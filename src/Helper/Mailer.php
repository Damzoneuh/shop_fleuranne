<?php


namespace App\Helper;


use Symfony\Bridge\Twig\Mime\TemplatedEmail;

trait Mailer
{
   public function createTemplatedMessage($target, $from, $vue, $subject, $context = []){
       $message = new TemplatedEmail();
       $message->to($target);
       $message->subject($subject);
       $message->from($from);
       $message->htmlTemplate($vue);
       $message->context($context);

       return $message;
   }

   public function verifyEmail($email){
       if (filter_var($email, FILTER_VALIDATE_EMAIL)){
           return true;
       }
       return false;
   }
}