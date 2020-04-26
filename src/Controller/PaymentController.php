<?php

namespace App\Controller;

use App\Entity\Command;
use App\Entity\Invoice;
use App\Entity\InvoiceLine;
use App\Entity\Item;
use App\Entity\Payment;
use App\Entity\TmpOrder;
use App\Entity\User;
use App\Helper\Mailer;
use App\Services\PaymentService;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
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
     * @param MailerInterface $mailer
     * @return Response
     * @throws TransportExceptionInterface
     * @throws Exception
     * @Route("/payment/success", name="payment_status")
     */
   public function paymentSuccess(Request $request, PaymentService $paymentService, MailerInterface $mailer){
       $payload = $paymentService->reformedPayloadReceived($request->getContent());
       $payment = $paymentService->createPayment(new Payment(), $payload);
        /** @var User $user */
       $user = $this->getDoctrine()->getRepository(User::class)->find($paymentService->getUserFromPayload($payload));
       $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
       $this->get('security.token_storage')->setToken($token);
       $this->get('session')->set('_security_main', serialize($token));

       $orderFromPayment = $this->getDoctrine()->getRepository(TmpOrder::class)->find($paymentService->getTmpOrder($payload));

       $em = $this->getDoctrine()->getManager();
       $em->persist($payment);
       $invoice = $paymentService->createInvoice(new Invoice(), $this->getUser(), $payment);
       $em->persist($invoice);
       $orderFromPaymentDecoded = $this->serializer->decode($orderFromPayment->getContent(), 'json');

       $command = new Command();
       $command->setStatus('En attente');
       $command->setInvoice($invoice);
       $command->setDeliveryAddress(intval($orderFromPaymentDecoded['deliverySelected']));
       $command->setInvoiceAddress(intval($orderFromPaymentDecoded['invoiceSelected']));
       $command->setMode(intval($orderFromPaymentDecoded['deliveryMode']));

       foreach ($orderFromPaymentDecoded['products'] as $ordered){
           /** @var Item $item */
           $item = $em->getRepository(Item::class)->find($ordered['item']['id']);
           $itemLine = $paymentService->createInvoiceLines($item, new InvoiceLine(), $invoice, $ordered['qty']);
           $em->persist($itemLine);
       }

       $em->persist($command);

       $em->flush();

       $em->remove($orderFromPayment);
       $em->flush();

       $this->addFlash('success', 'Votre payment à bien été accépté .');

        $context = [
            'payload' => $paymentService->createTotalPayload($orderFromPaymentDecoded),
            'content' => 'Votre commande à bien été enregistré, vous pouvez consulter son avancement dans vos paramètres sur le site fleuranne.fr',
            'subject' => 'Facture ' . $invoice->getPayment()->getTransactionUuid()
        ];
        $message = $this->createTemplatedMessage($user->getEmail(),
            'facture@fleuranne.fr',
            'email/invoice.html.twig',
            'Suivi de votre commande',
            $context
        );
        $mailer->send($message);

        $message = $this->createTemplatedMessage(
            'fleuranne@bbox.fr',
            'order@fleuranne.fr',
            'email/order.html.twig',
            'Nouvelle commande',
            [
                'uuid' => $command->getId(),
                'content' => 'Vous avez reçu une nouvelle commande ',
                'subject' => 'Commande : ' . $payment->getTransactionUuid()
            ]
        );

        $mailer->send($message);

        return $this->render('payment/success.html.twig');
   }

    /**
     * @param Request $request
     * @param PaymentService $paymentService
     * @return RedirectResponse
     * @Route("/payment/error", name="payment_error")
     */
   public function paymentError(Request $request, PaymentService $paymentService){
       $payload = $paymentService->reformedPayloadReceived($request->getContent());
       /** @var User $user */
       $user = $this->getDoctrine()->getRepository(User::class)->find($paymentService->getUserFromPayload($payload));
       $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
       $this->get('security.token_storage')->setToken($token);
       $this->get('session')->set('_security_main', serialize($token));

       $orderFromPayment = $this->getDoctrine()->getRepository(TmpOrder::class)->find($paymentService->getTmpOrder($payload));

       $em = $this->getDoctrine()->getManager();
       $em->remove($orderFromPayment);
       $em->flush();

       $this->addFlash('error', 'Une erreur est survenue lors du payment');

       return $this->redirectToRoute('basket');
   }

    /**
     * @param Request $request
     * @param PaymentService $paymentService
     * @return RedirectResponse
     * @Route("/payment/cancel", name="payment_cancel")
     */
   public function paymentCancel(Request $request, PaymentService $paymentService){
       $payload = $paymentService->reformedPayloadReceived($request->getContent());
       /** @var User $user */
       $user = $this->getDoctrine()->getRepository(User::class)->find($paymentService->getUserFromPayload($payload));
       $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
       $this->get('security.token_storage')->setToken($token);
       $this->get('session')->set('_security_main', serialize($token));

       $orderFromPayment = $this->getDoctrine()->getRepository(TmpOrder::class)->find($paymentService->getTmpOrder($payload));

       $em = $this->getDoctrine()->getManager();
       $em->remove($orderFromPayment);
       $em->flush();

       $this->addFlash('error', 'Votre payment à été annulé');

       return $this->redirectToRoute('basket');
   }

    /**
     * @param Request $request
     * @param PaymentService $paymentService
     * @return RedirectResponse
     * @Route("/payment/refused", name="payment_refused")
     */
   public function paymentRefused(Request $request, PaymentService $paymentService){
       $payload = $paymentService->reformedPayloadReceived($request->getContent());
       /** @var User $user */
       $user = $this->getDoctrine()->getRepository(User::class)->find($paymentService->getUserFromPayload($payload));
       $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
       $this->get('security.token_storage')->setToken($token);
       $this->get('session')->set('_security_main', serialize($token));

       $orderFromPayment = $this->getDoctrine()->getRepository(TmpOrder::class)->find($paymentService->getTmpOrder($payload));

       $em = $this->getDoctrine()->getManager();
       $em->remove($orderFromPayment);
       $em->flush();

       $this->addFlash('error', 'Le payment à été refusé par votre banque si le problème persiste, contactez votre établissmement banquaire .');
       return $this->redirectToRoute('basket');
   }
}
