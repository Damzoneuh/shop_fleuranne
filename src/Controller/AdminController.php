<?php


namespace App\Controller;


use App\Entity\Command;
use App\Entity\Invoice;
use App\Entity\Payment;
use App\Helper\CommandHelper;
use App\Helper\Mailer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
    use CommandHelper;
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
     * @param $id
     * @return Response
     * @Route("/admin/order/{id}", name="admin_get_order")
     * @throws TransportExceptionInterface
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

        if ($form->isSubmitted() && $form->isValid()){
            $user = $order->getInvoice()->getBuyer();
            $nextStep = $this->getNextCommandStep($user, $order->getStatus(), $order->getMode());
            $em = $this->getDoctrine()->getManager();
            $order->setStatus($nextStep['step']);
            $em->flush();

            $mailer->send($nextStep['message']);

            return $this->redirectToRoute('admin_get_order', ['id' => $id]);
        }

        return $this->render('admin/order.html.twig', ['order' => $order, 'form' => $form->createView()]);
    }
}