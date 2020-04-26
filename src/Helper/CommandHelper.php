<?php


namespace App\Helper;


use App\Entity\User;

trait CommandHelper
{
    use Mailer;
    public function getNextCommandStep(User $user,$step, $mode){
        if ($step == 'En attente'){
            if ($mode == 1){
                $context = [
                    'subject' => 'Suivi de votre commande',
                    'content' => 'Votre Commande à été récéptionné et est actuellement en cours de conditionnement'
                ];
                $message = self::prepareMessage($user, $context);
                return [
                    'step' => 'En cours de préparation',
                    'message' => $message
                ];
            }
            $context = [
                'subject' => 'Suivi de votre commande',
                'content' => 'Votre Commande à été préparé, vous pouvez dès à présent venir la récupérer .'
            ];
            $message = self::prepareMessage($user, $context);
            return [
                'step' => 'Prête',
                'message' => $message
            ];
        }
        $context = [
            'subject' => 'Suivi de votre commande',
            'content' => 'Votre commande à été éxpédiée, elle sera livrée à l\'adresse indiqué lors de la commande dans un délais de 72h .'
        ];
        $message = self::prepareMessage($user, $context);
        return [
            'step' => 'Expédié',
            'message' => $message
        ];
    }

    public function prepareMessage(User $user, $context){
        return $this->createTemplatedMessage(
            $user->getEmail(),
            'commande@fleuranne.fr',
            'email/followingCommand.html.twig',
            'Suivi de commande',
            $context
        );
    }
}