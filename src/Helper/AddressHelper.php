<?php


namespace App\Helper;


use App\Entity\Address;
use App\Entity\User;

trait AddressHelper
{
    public function setNewAddress(Address $address,User $user, array $payLoad, string $type){
        $address->setCity($payLoad['city']);
        $address->setCountry($payLoad['country']);
        $address->setNumber($payLoad['number']);
        $address->setStreet($payLoad['street']);
        $address->setStreetComplement($payLoad['streetComplement']);
        $address->setType($payLoad['type']);
        $address->setZip($payLoad['zip']);
        if ($type == 'delivery'){
            $address->setDeliveryAddress($user);
        }
        if ($type == 'invoice'){
            $address->setInvoiceAddress($user);
        }
        if ($type == 'both'){
            $address->setInvoiceAddress($user);
            $address->setDeliveryAddress($user);
        }

        return $address;
    }
}