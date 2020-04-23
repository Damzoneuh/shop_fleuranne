<?php
/**
 * @author Damien Reb < damien@backndev.fr >
 */

namespace App\Helper;


use App\Entity\User;
use Exception;

trait PaymentHelper
{
    public function createSign(array $payload, $shopKey){
        $sign = '';
        ksort($payload);
        foreach ($payload as $key => $value){
            $sign .= $value.'+';
        }
        $sign .= $shopKey;
        return base64_encode(hash_hmac('sha256',$sign, $shopKey, true));
    }

    /**
     * @param User $user
     * @param $price
     * @param $env
     * @param $siteId
     * @param $transactionId
     * @param $orderId
     * @param $key
     * @param $appUrl
     * @param $tmpId
     * @return array
     * @throws Exception
     */
    public function createPayload(User $user, $price, $env, $siteId, $transactionId, $orderId, $key, $appUrl, $tmpId){
        $prePayLoad = $this->createPrePayload($user, $price, $env, $siteId, $transactionId, $orderId, $appUrl, $tmpId);
        $sign = $this->createSign($prePayLoad, $key);
        $prePayLoad['signature'] = $sign;
        return $prePayLoad;
    }

    /**
     * @return string
     * @throws Exception
     */
    private function getPayloadDate(){
        $date = new \DateTime('now', new \DateTimeZone('UTC'));
        return $date->format('YmdHis');
    }

    /**
     * @param User $user
     * @param $price
     * @param $env
     * @param $siteId
     * @param $transactionId
     * @param $orderId
     * @param $appUrl
     * @param $tmpId
     * @return array
     * @throws Exception
     */
    private function createPrePayload(User $user, $price, $env, $siteId, $transactionId, $orderId, $appUrl, $tmpId){
        return [
            'vads_action_mode' => 'INTERACTIVE',
            'vads_amount' => self::definePrice($price),
            'vads_capture_delay' => 0,
            'vads_ctx_mode' => $env,
            'vads_currency' => 978,
            'vads_cust_id' => $user->getId(),
            'vads_ext_info_tmp_id' => $tmpId,
            'vads_order_id' => $orderId,
            'vads_page_action' => 'PAYMENT',
            'vads_payment_config' => 'SINGLE',
            'vads_return_mode' => 'POST',
            'vads_site_id' => $siteId,
            'vads_trans_date' => $this->getPayloadDate(),
            'vads_trans_id' => $transactionId,
            'vads_url_cancel' => $appUrl . '/payment/cancel',
            'vads_url_error' => $appUrl . '/payment/error',
            'vads_url_refused' => $appUrl . '/payment/refused',
            'vads_url_success' => $appUrl . '/payment/success',
            'vads_version' => 'V2'
        ];
    }

    private function definePrice($price){
        $stringPrice = self::floatToString($price);
        if (!strstr($stringPrice, '.')){
            return $price * 100;
        }
        return intval(str_replace('.', '' , $price));
    }

    private function floatToString($float){
        return strval($float);
    }

    public function reformedPayloadReceived(string $content){
        $precompiledArray = explode('&', $content);
        $reformedArray = [];
        foreach ($precompiledArray as $haystack){
            $pos = strpos($haystack, '=');
            $key = substr($haystack, 0, $pos);
            $value = substr($haystack, $pos + 1, strlen($haystack));
            $reformedArray[$key] = urldecode($value);
        }
        return $reformedArray;
    }
}