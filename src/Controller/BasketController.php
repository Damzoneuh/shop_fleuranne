<?php

namespace App\Controller;

use App\Entity\User;
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
}
