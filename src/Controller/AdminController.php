<?php


namespace App\Controller;


use App\Entity\Address;
use App\Entity\Command;
use App\Entity\Invoice;
use App\Entity\Payment;
use App\Helper\CommandHelper;
use App\Helper\Mailer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class AdminController extends AbstractController
{
    use CommandHelper;

    private $context;
    private $serializer;
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
     * @return Response
     * @Route("/admin", name="admin")
     */
    public function index(){
        return $this->render('admin/index.html.twig');
    }

    /**
     * @return Response
     * @Route("/admin/shop", name="admin_shop")
     */
    public function shop(){
        return $this->render('admin/admin-shop.html.twig');
    }

    /**
     * @param Request $request
     * @param MailerInterface $mailer
     * @param $id
     * @return Response
     * @throws TransportExceptionInterface
     * @Route("/admin/order/{id}", name="admin_get_order")
     */
    public function getOrder(Request $request, MailerInterface $mailer, $id){
        /** @var Command $order */
        $order = $this->getDoctrine()->getRepository(Command::class)->find($id);
        $form = $this->createFormBuilder()
            ->add('next', SubmitType::class, [
                'label' => 'Etape suivante',
                'attr' => [
                    'class' => 'btn btn-group btn-grey'
                ]
            ])
            ->getForm();

        $form->handleRequest($request);

        $invoiceAddress = $this->getDoctrine()->getRepository(Address::class)->find($order->getInvoiceAddress());
        $deliveryAddress = $this->getDoctrine()->getRepository(Address::class)->find($order->getDeliveryAddress());

        if ($form->isSubmitted() && $form->isValid()){
            $user = $order->getInvoice()->getBuyer();
            $nextStep = $this->getNextCommandStep($user, $order->getStatus(), $order->getMode());
            $em = $this->getDoctrine()->getManager();
            $order->setStatus($nextStep['step']);
            $em->flush();

            $mailer->send($nextStep['message']);

            return $this->redirectToRoute('admin_get_order', ['id' => $id]);
        }

        return $this->render('admin/order.html.twig', [
            'order' => $order,
            'form' => $form->createView(),
            'deliveryAddress' => $deliveryAddress,
            'invoiceAddress' => $invoiceAddress
        ]);
    }

    /**
     * @param null $id
     * @return JsonResponse
     * @Route("/admin/api/order/{id}", name="admin_api_order", methods={"GET"})
     */
    public function getAdminOrder($id = null){
        if ($id){
            return $this->json($this->getDoctrine()->getRepository(Command::class)->find($id), 200, [], $this->context);
        }
        return $this->json($this->getDoctrine()->getRepository(Command::class)->findAll(), 200, [], $this->context);
    }
}