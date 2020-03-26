<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class ParametersController extends AbstractController
{
    /**
     * @Route("/parameters", name="parameters")
     */
    public function index()
    {
        return $this->render('parameters/index.html.twig');
    }

}
