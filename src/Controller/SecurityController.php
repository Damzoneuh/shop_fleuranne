<?php

namespace App\Controller;

use App\Entity\User;
use App\Helper\Mailer;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\PasswordEncoderInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class SecurityController extends AbstractController
{
    use Mailer;
    private $serializer;

    public function __construct()
    {
        $encoders = [new XmlEncoder(), new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];

        $this->serializer = new Serializer($normalizers, $encoders);
    }
    /**
     * @Route("/login", name="app_login")
     * @param AuthenticationUtils $authenticationUtils
     * @return Response
     */
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        $error = $authenticationUtils->getLastAuthenticationError();

        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }

    /**
     * @Route("/logout", name="app_logout")
     */
    public function logout()
    {
        return $this->redirectToRoute('index');
    }

    /**
     * @param Request $request
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param MailerInterface $mailer
     * @return Response
     * @throws TransportExceptionInterface
     * @throws Exception
     * @Route("/register", name="register")
     */
    public function register(Request $request, UserPasswordEncoderInterface $passwordEncoder, MailerInterface $mailer){
        $form = $this->createFormBuilder()
            ->add('email', EmailType::class, [
                'label' => 'Email'
            ])
            ->add('password', PasswordType::class, [
                'label' => 'Mot de passe'
            ])
            ->add('plainPassword', PasswordType::class, [
                'label' => 'Confirmez votre mot de passe'
            ])
            ->add('acceptCGU', CheckboxType::class, [
                'label' => 'En cochant cette case vous acceptez que vos données personnelles soient stockées conformément au CGU'
            ])
            ->add('newsletter', CheckboxType::class, [
                'required' => false,
                'label' => 'En cochant cette case vous acceptez de recevoir nos newsletter, il est possible de modifier ce choix à tout moment dans vos paramettres de compte',
                'data' => true
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Envoyer',
                'attr' => [
                    'class' => 'btn btn-group btn-pink'
                ]
            ])
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()){
            $data = $form->getData();
            $em = $this->getDoctrine()->getManager();
            $user = new User();
            if($em->getRepository(User::class)->findOneBy(['email' => $data['email']])){
                $this->addFlash('error', 'Cet Email existe déjà');
                return $this->redirectToRoute('register');
            }
            if ($data['password'] != $data['plainPassword']){
                $this->addFlash('error', 'Les mots de passe ne correspondent pas');
                return $this->redirectToRoute('register');
            }
            if (!$this->verifyEmail($data['email'])){
                $this->addFlash('error', 'Votre email est invalide');
                return $this->redirectToRoute('register');
            }
            $user->setEmail($data['email']);
            $user->setPassword($passwordEncoder->encodePassword($user, $data['password']));
            $token = bin2hex(random_bytes(16));
            $user->setResetToken($token);
            $user->setIsValidated(false);
            $user->setNewsletter($data['newsletter']);
            $user->setIsDeleted(false);

            $mailer->send($this->createTemplatedMessage($user->getEmail(), 'account@fleuranne.fr', 'email/register.html.twig',
                'Validation de votre compte sur Fleuranne.fr', [
                    'subject' => 'Validation de votre compte sur Fleuranne.fr',
                    'content' => 'Afin de valider votre compte nous vous invitons à cliquer sur le lien ci-dessous',
                    'token' => $token,
                    'route' => 'register_mail'
                ]));

            $em->persist($user);
            $em->flush();

            $this->addFlash('success', 'Un email vous à été envoyé à l\'adresse ' . $user->getEmail());
            return $this->redirectToRoute('index');
        }

        return $this->render('security/register.html.twig', ['form' => $form->createView()]);
    }

    /**
     * @param $token
     * @return RedirectResponse|Response
     * @Route("/register/{token}", name="register_mail")
     */
    public function registerMail($token){
        $em = $this->getDoctrine()->getManager();
        if ($user = $em->getRepository(User::class)->findOneBy(['resetToken' => $token])){
            $user->setResetToken(null);
            $user->setIsValidated(true);
            $em->flush();

            $this->addFlash('success', 'Merci, votre compte à bien été activé');
            return $this->redirectToRoute('index');
        }

        $this->addFlash('error', 'Une erreur est survenue lors de l\'activation de votre compte. Afin de régler ce problème merci de nous faire part de votre problème par le formulaire de contact .');
        return $this->redirectToRoute('index');
    }

    /**
     * @param Request $request
     * @param MailerInterface $mailer
     * @return Response
     * @throws Exception
     * @throws TransportExceptionInterface
     * @Route("/reset", name="reset")
     */
    public function reset(Request $request, MailerInterface $mailer){
        $form = $this->createFormBuilder()
            ->add('email', EmailType::class, [
                'label' => 'Email'
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'envoyer',
                'attr' => [
                    'class' => 'btn btn-group btn-pink'
                ]
            ])
            ->getForm();
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()){
            $data = $form->getData();
            if (!$this->verifyEmail($data['email'])){
                $this->addFlash('error', 'L\'email entré est invalide');
                return $this->redirectToRoute('reset');
            }
            $em = $this->getDoctrine()->getManager();
            if ($user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']])){
                $token = bin2hex(random_bytes(16));
                $user->setResetToken($token);
                $em->flush();

                $mailer->send($this->createTemplatedMessage(
                    $user->getEmail(), 'account@fleuranne.fr', 'email/register.html.twig', 'Réinitialisation de votre mot de passe',
                    [
                        'subject' => 'Réinitialisation de votre mot de passe',
                        'content' => 'Afin de réinitialiser votre mot de passe nous vous invitons à cliquer sur le lien ci-dessous',
                        'token' => $token,
                        'route' => 'reset_mail'
                    ]
                ));

                $this->addFlash('success', 'Afin de réinitialiser votre mot de passe un mail vous à été envoyé à l\'adresse : ' . $user->getEmail());
                return $this->redirectToRoute('app_logout');
            }

            $this->addFlash('error', 'L\'email que vous avez entré est introuvable');
            return $this->redirectToRoute('reset');
        }

        return $this->render('security/reset.html.twig', ['form' => $form->createView()]);
    }

    /**
     * @param Request $request
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param $token
     * @return RedirectResponse|Response
     * @Route("/reset/{token}", name="reset_mail")
     */
    public function resetMail(Request $request, UserPasswordEncoderInterface $passwordEncoder, $token){
        $em = $this->getDoctrine()->getManager();
        if(!$user = $em->getRepository(User::class)->findOneBy(['resetToken' => $token])){
            $this->addFlash('error', 'Le jeton de réinitialisation ne corespond à aucun utilisateur');
            return $this->redirectToRoute('reset');
        }

        $form = $this->createFormBuilder()
            ->add('password', PasswordType::class, [
                'label' => 'Nouveau mot de passe'
            ])
            ->add('plainPassword', PasswordType::class, [
                'label' => 'Confirmez votre nouveau mot de passe'
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Envoyer',
                'attr' => [
                    'class' => 'btn btn-group btn-pink'
                ]
            ])
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()){
            $data = $form->getData();
            if ($data['password'] != $data['plainPassword']){
                $this->addFlash('error', 'Les mots de passe ne correspondent pas');
                return $this->render('security/reset.html.twig', ['form' => $form->createView()]);
            }
            $user->setPassword($passwordEncoder->encodePassword($user, $data['password']));
            $user->setResetToken(null);
            $em->flush();

            $this->addFlash('success', 'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe');
            return $this->redirectToRoute('app_login');
        }

        return $this->render('security/reset.html.twig', ['form' => $form->createView()]);
    }

    /**
     * @return JsonResponse
     * @Route("/api/user", name="api_user", methods={"GET"})
     */
    public function getCurrentUser()
    {
        return $this->json($this->getUser());
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws Exception
     * @Route("/api/user/phone", name="api_user_phone", methods={"PUT"})
     */
    public function editPhone(Request $request){
        $data = $this->serializer->decode($request->getContent(), 'json');
        $em = $this->getDoctrine()->getManager();
        /** @var User $user */
        $user = $this->getUser();

        if (!$data['phone']){
            $user->setPhone(null);
            $em->flush();
            return $this->json(['success' => 'Votre numéro de téléphone à bien été supprimé']);
        }

        $user->setPhone(intval($data['phone']));
        $em->flush();

        return $this->json(['success' => 'Votre numéro de téléphone à bien été mis à jour']);
    }

    /**
     * @return RedirectResponse
     * @Route("/user/delete", name="user_delete")
     */
    public function deleteUser(){

        $em = $this->getDoctrine()->getManager();
        /** @var User $user */
        $user = $this->getUser();
        $user->setIsDeleted(true);
        $em->flush();

        $this->addFlash('success', 'Votre compte à bien été supprimé');
        return $this->redirectToRoute('app_logout');
    }
}
