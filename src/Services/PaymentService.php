<?php


namespace App\Services;


use App\Entity\Command;
use App\Entity\Invoice;
use App\Entity\InvoiceLine;
use App\Entity\Item;
use App\Entity\Payment;
use App\Entity\User;
use App\Helper\PaymentHelper;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class PaymentService
{

    use PaymentHelper;
    private $parameter;
    private $em;

    public function __construct(ParameterBagInterface $bag, EntityManagerInterface $entityManager)
    {
        $this->parameter = $bag;
        $this->em = $entityManager;
    }

    /**
     * @param User $user
     * @param $price
     * @param $appUrl
     * @param $tmpId
     * @return array
     * @throws Exception
     */
    public function createPaymentPayload(User $user, $price, $appUrl, $tmpId){
        $env = $this->parameter->get('APP_ENV') == 'dev' ? 'TEST' : 'PRODUCTION';
        return $this->createPayload($user, $price,$env, $this->parameter->get('SHOP_ID'),
            self::createTransactionId(), self::createOrderId(), $this->parameter->get('SHOP_API_KEY'), $appUrl, $tmpId);
    }

    private function createOrderId(){
        try{
            $order = $this->em->getRepository(Command::class)->findOneBy([], ['id' => 'DESC']);
        }catch (Exception $e){
            return 1;
        }
        if (!$order){
            return 1;
        }
        return $order->getId();
    }

    /**
     * @return string
     * @throws Exception
     */
    private function createTransactionId(){
        $id = self::createRandom();
        while ($id == $this->em->getRepository(Payment::class)->findOneBy(['transactionId' => $id])){
            $id = self::createRandom();
        }
        return $id;
    }

    /**
     * @return string
     * @throws Exception
     */
    private static function createRandom(){
        return bin2hex(random_bytes(3));
    }

    public function reformPayload(string $content){
        return $this->reformedPayloadReceived($content);
    }

    /**
     * @param Payment $payment
     * @param array $payload
     * @return Payment
     * @throws Exception
     */
    public function createPayment(Payment $payment,array $payload){
        $payment->setAmount(floatval($payload['vads_amount']) / 100);
        $payment->setCardNumber($payload['vads_card_number']);
        $payment->setCertificate($payload['vads_payment_certificate']);
        $payment->setDate(new \DateTime('now', new \DateTimeZone('UTC')));
        $payment->setStatus($payload['vads_trans_status']);
        $payment->setTransactionId($payload['vads_trans_id']);
        $payment->setTransactionUuid($payload['vads_trans_uuid']);
        return $payment;
    }

    public function getUserFromPayload($payload){
        return $payload['vads_cust_id'];
    }

    public function getTmpOrder(array $payload){
        return $payload['vads_ext_info_tmp_id'];
    }

    public function createInvoiceLines(Item $item, InvoiceLine $invoiceLine, Invoice $invoice,$quantity){
        $invoiceLine->setName($item->getName());
        $invoiceLine->setPrice($item->getPrice() * $quantity);
        $invoiceLine->setProm($item->getProm());
        $invoiceLine->setRef($item->getRef());
        $invoiceLine->setInvoice($invoice);
        $invoiceLine->setQuantity($quantity);
        return $invoiceLine;
    }

    public function createInvoice(Invoice $invoice, User $user, Payment $payment){
        $invoice->setBuyer($user);
        $invoice->setPayment($payment);
        return $invoice;
    }

    public function createTotalPayload(array $payload){
        $returnedArray = [];
        $itemArray = [];
        $totalPrice = 0;
        $products = $payload['products'];
        foreach ($products as $product){
            $price = self::applyPromAndQuantity($product['item']['price'], $product['qty'], $product['item']['prom']);
            array_push($itemArray, [
                'name' => $product['item']['name'],
                'prom' => $product['item']['prom'] ? $product['item']['prom'] : null,
                'qty' => $product['qty'],
                'price' => $price
            ]);
            $returnedArray['items'] = $itemArray;
            $totalPrice += $price;
        }
        $returnedArray['port'] = self::getPortPrice($totalPrice, $payload['deliveryMode']);
        $returnedArray['total'] = $returnedArray['port'] == 0 ? $totalPrice : $totalPrice + $returnedArray['port'];
        $returnedArray['mode'] = $payload['deliveryMode'] == "1" ? 1 : 2;

        return $returnedArray;
    }

    private static function applyPromAndQuantity($price, $quantity, $prom = null){
        if (!$prom){
            return $price * $quantity;
        }
        $promotedValue = round($price / $prom , 2);
        $promotedPrice = $price - $promotedValue;
        return $promotedPrice * $quantity;
    }

    private static function getPortPrice($totalPrice, $mode){
        if ($totalPrice > 75 || intval($mode) != 1){
            return 0;
        }
        return 5.95;
    }
}