<?php

namespace App\Controller;

use App\Entity\Command;
use App\Entity\Invoice;
use App\Entity\InvoiceLine;
use App\Entity\Item;
use App\Entity\Order;
use App\Entity\Payment;
use App\Entity\TmpOrder;
use App\Entity\User;
use App\Helper\Mailer;
use App\Services\PaymentService;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class PaymentController extends AbstractController
{
    use Mailer;
    private $context;
    private $serializer;
    public function __construct()
    {
        $this->context = [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($object, $format, $context) {
                return $object->getName();
            },
        ];


        $encoders = [new XmlEncoder(), new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];

        $this->serializer = new Serializer($normalizers, $encoders);
    }

    /**
     * @param Request $request
     * @param PaymentService $paymentService
     * @return JsonResponse
     * @throws Exception
     * @Route("/payment/success", name="payment_status")
     */
   public function paymentSuccess(Request $request, PaymentService $paymentService){
       $payload = $paymentService->reformedPayloadReceived($request->getContent());
       $payment = $paymentService->createPayment(new Payment(), $payload);

       $user = $this->getDoctrine()->getRepository(User::class)->find($paymentService->getUserFromPayload($payload));
       $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
       $this->get('security.token_storage')->setToken($token);
       $this->get('session')->set('_security_main', serialize($token));

       $orderFromPayment = $this->getDoctrine()->getRepository(TmpOrder::class)->find($paymentService->getTmpOrder($payload));
       //dump($this->serializer->decode($orderFromPayment->getContent(), 'json'));die();

       $em = $this->getDoctrine()->getManager();
       $em->persist($payment);
       $invoice = $paymentService->createInvoice(new Invoice(), $this->getUser(), $payment);
       $em->persist($invoice);

       $orderFromPaymentDecoded = $this->serializer->decode($orderFromPayment->getContent(), 'json');
       foreach ($orderFromPaymentDecoded['products'] as $ordered){
           //dump($ordered['item']); die();
           $itemLine = $paymentService->createInvoiceLines($em->getRepository(Item::class)->find($ordered['item']['id']), new InvoiceLine(), $invoice, $ordered['qty']);
           $em->persist($itemLine);
       }

       $em->flush();

       $command = new Command();
       $command->setStatus('En attente');
       $command->setInvoice($invoice);
       $em->persist($command);
       $em->flush();

       $em->remove($orderFromPayment);
       $em->flush();

       return $this->json($command);
   }
}
