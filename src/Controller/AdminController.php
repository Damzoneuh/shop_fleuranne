<?php


namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
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
}