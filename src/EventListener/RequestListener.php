<?php


namespace App\EventListener;


use App\Entity\User;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\Flash\FlashBagInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class RequestListener
{
    private $urlGenerator;
    private $flashbag;

    public function __construct(UrlGeneratorInterface $urlGenerator, FlashBagInterface $bag)
    {
        $this->urlGenerator = $urlGenerator;
        $this->flashbag = $bag;
    }

    public function onKernelRequest(RequestEvent $requestEvent){
        if (!$requestEvent->isMasterRequest()){
            return;
        }
        /** @var User $user */
        if ($user = $requestEvent->getRequest()->getUser()){
            if (!$user->getIsValidated()){
                $this->flashbag->add('error', 'Vous devez activer votre compte afin de continer la navigation');
                return new RedirectResponse($this->urlGenerator->generate('index'));
            }
        }
        return;
    }
}