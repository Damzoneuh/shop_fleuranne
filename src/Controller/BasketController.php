<?php

namespace App\Controller;

use App\Entity\TmpOrder;
use App\Entity\User;
use App\Services\PaymentService;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class BasketController extends AbstractController
{
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
     * @Route("/basket", name="basket")
     */
    public function index()
    {
        return $this->render('basket/index.html.twig');
    }

    /**
     * @param Session $session
     * @param Request $request
     * @return JsonResponse
     * @Route("/api/basket/session", name="api_basket_session", methods={"POST"})
     */
    public function setValidateSession(Session $session, Request $request){
        $data = $this->serializer->decode($request->getContent(), 'json');
        $session->set('basket', $data);
        return $this->json(['success', 'session set']);
    }

    /**
     * @param Session $session
     * @return Response
     * @Route("/basket/validation", name="basket_validation")
     */
    public function validateBasket(Session $session){
        return $this->render('basket/confirm.html.twig');
    }

    /**
     * @param Session $session
     * @param Request $request
     * @return JsonResponse
     * @Route("/api/basket/session/command", name="api_basket_session_command", methods={"POST"})
     */
    public function setSessionForCommand(Session $session, Request $request){
        $data = $this->serializer->decode($request->getContent(), 'json');
        $session->set('command', $data);
        return $this->json(['success' => 'session set']);
    }

    /**
     * @param Session $session
     * @param PaymentService $service
     * @param Request $request
     * @return Response
     * @throws Exception
     * @Route("/basket/recap", name="basket_recap")
     */
    public function basketRecap(Session $session, PaymentService $service, Request $request){

        /** @var User $user */
        $user = $this->getUser();
        $command = $session->get('command');
        $em = $this->getDoctrine()->getManager();
        $tmp = new TmpOrder();
        $tmp->setContent($this->serializer->encode($command, 'json'));

        $em->persist($tmp);
        $em->flush();

        $payload = $service->createPaymentPayload($user , 20, 'https://' . $request->getHost(), $tmp->getId());

        return $this->render('basket/recap.html.twig', [
            'command' => $command,
            'payload' => $payload
        ]);
    }
}
