<?php

namespace App\Controller;

use App\Entity\Address;
use App\Entity\Command;
use App\Entity\Invoice;
use App\Entity\User;
use App\Helper\AddressHelper;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class ParametersController extends AbstractController
{
    use AddressHelper;
    private $serializer;
    private $context;

    public function __construct()
    {

        $this->context = [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($object, $format, $context) {
                return $object;
            },
        ];

        $encoders = [new XmlEncoder(), new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];

        $this->serializer = new Serializer($normalizers, $encoders);
    }

    /**
     * @Route("/parameters", name="parameters")
     */
    public function index()
    {
        return $this->render('parameters/index.html.twig');
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route("/api/parameters/address/create", name="api_parameters_address_create", methods={"POST"})
     */
    public function addAddress(Request $request){
        /** @var User $user */
        $user = $this->getUser();
        $data = $this->serializer->decode($request->getContent(), 'json');
        $address = new Address();
        $createdAddress = $this->setNewAddress($address, $user, $data, $data['addressType']);

        $em = $this->getDoctrine()->getManager();
        $em->persist($createdAddress);
        $em->flush();

        return $this->json(['success', 'L\'adresse à bien été crée']);
    }

    /**
     * @param $id
     * @return JsonResponse
     * @Route("/api/parameters/address/delete/{id}", name="api_parameters_address_delete", methods={"DELETE"})
     */
    public function deleteAddress($id){
        $em = $this->getDoctrine()->getManager();
        $address = $em->getRepository(Address::class)->find($id);
        if (!$address){
            throw new NotFoundHttpException();
        }
        /** @var User $user */
        $user = $this->getUser();
        if (!$user->getDeliveryAddress() && !$user->getInvoiceAdress()){
            throw new NotFoundHttpException();
        }
        $invoiceAddresses = $user->getInvoiceAdress();
        $deliveryAddresses = $user->getDeliveryAddress();
        if ($invoiceAddresses){
           $invoiceAddresses->remove($address);
           $em->flush();
        }
        if ($deliveryAddresses){
            $deliveryAddresses->remove($address);
            $em->flush();
        }
        $em->remove($address);
        $em->flush();

        return $this->json(['success' => 'L\'adresse à bien été supprimée']);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route("/api/parameters/address/edit", name="api_parameters_address_edit", methods={"PUT"})
     */
    public function editAddress(Request $request){
        $data = $this->serializer->decode($request->getContent(), 'json');
        /** @var User $user */
        $user = $this->getUser();
        $em = $this->getDoctrine()->getManager();
        $address = $em->getRepository(Address::class)->find($data['id']);

        $addressCreated = $this->setNewAddress($address, $user, $data, $data['addressType']);
        $em->flush();

        return $this->json(['success', 'L\'adresse à bien été modifiée']);
    }

    /**
     * @param $type
     * @param $id
     * @return JsonResponse
     * @Route("/api/parameters/address/settype/{type}/{id}", name="api_parameters_address_set_type", methods={"POST"})
     */
    public function addAddressType($type, $id){

        $em = $this->getDoctrine()->getManager();
        $address = $em->getRepository(Address::class)->find($id);
        /** @var User $user */
        $user = $this->getUser();
        $message = null;

        if ($type == 'invoice'){
            $address->setInvoiceAddress($user);
            $message = 'L\'adresse à bien été ajoutée en tant qu\'adresse de facturation';
        }

        if ($type == 'delivery'){
            $address->setDeliveryAddress($user);
            $message = 'L\'adresse à bien été ajoutée en tant qu\'adresse de livraison';
        }

        if ($type == 'both'){
            $address->setDeliveryAddress($user);
            $address->setInvoiceAddress($user);
            $message = 'L\'adresse à bien été ajoutée en tant qu\'adresse de facturation et de livraison';
        }

        $em->flush();

        return $this->json(['success' => $message]);
    }

    /**
     * @return JsonResponse
     * @Route("/api/newsletter", name="api_newsletter", methods={"PUT"})
     */
    public function setNewsLetter(){
        $em = $this->getDoctrine()->getManager();
        /** @var User $user */
        $user = $this->getUser();

        if (!$user){
            throw new NotFoundHttpException();
        }

        if ($user->getNewsletter()){
            $user->setNewsletter(false);
            $em->flush();

            return $this->json(['success' => 'La newsletter à bien été désactivée']);
        }

        $user->setNewsletter(true);
        $em->flush();

        return $this->json(['success' => 'La newsletter à bien été activée']);
    }

    /**
     * @return JsonResponse
     * @Route("/api/address/invoice", name="api_invoice_address", methods={"GET"})
     */
    public function getInvoiceAddresses(){
        /** @var User $user */
        $user = $this->getUser();
        return $this->json($user->getInvoiceAdress()->count() > 0 ? $user->getInvoiceAdress()->getValues() : [], 200 ,[], $this->context);
    }

    /**
     * @return JsonResponse
     * @Route("/api/address/delivery", name="api_delivery_address", methods={"GET"})
     */
    public function getDeliveryAddress(){
        /** @var User $user */
        $user = $this->getUser();
        return $this->json($user->getDeliveryAddress()->count() > 0 ? $user->getDeliveryAddress()->getValues() : [], 200 ,[], $this->context);
    }

    /**
     * @param $id
     * @return JsonResponse
     * @Route("/api/address/{id}", name="api_address", methods={"GET"})
     */
    public function getAddress($id){
        if ($this->isGranted('ROLE_ADMIN')){
            return $this->json($this->getDoctrine()->getRepository(Address::class)->find($id), 200, [], $this->context);
        }

        /** @var User $user */
        $user = $this->getUser();
        /** @var Address $address */
        $address = $this->getDoctrine()->getRepository(Address::class)->find($id);
        if ($user->getId() == $address->getInvoiceAddress()->getId() || $user->getId() == $address->getDeliveryAddress()->getId()) {
            return $this->json($address, 200, [], $this->context);
        }

        throw new AccessDeniedException();
    }

    /**
     * @param null $id
     * @return Response
     * @Route("/parameters/order/{id}", name="parameters_order")
     */
    public function getOrders($id = null){
        if ($id){
            //TODO render the vue
        }
        /** @var User $user */
        $user = $this->getUser();

        $invoices = $user->getInvoices();
        $orders = [];
        if ($invoices->count() > 0){
            foreach ($invoices->getValues() as $invoice){
                /** @var Invoice $invoice */
                $order = $this->getDoctrine()->getRepository(Command::class)->findOneBy(['invoice' => $invoice->getId()]);
                array_push($orders, $order);
            }
        }

        return $this->render('parameters/orders.html.twig', ['orders' => $orders]);
    }
}
