<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CommandRepository")
 */
class Command
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Invoice", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $invoice;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $status;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $message;

    /**
     * @ORM\Column(type="integer")
     */
    private $mode;

    /**
     * @ORM\Column(type="integer")
     */
    private $deliveryAddress;

    /**
     * @ORM\Column(type="integer")
     */
    private $invoiceAddress;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getInvoice(): ?Invoice
    {
        return $this->invoice;
    }

    public function setInvoice(Invoice $invoice): self
    {
        $this->invoice = $invoice;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(?string $message): self
    {
        $this->message = $message;

        return $this;
    }


    public function getMode(): ?int
    {
        return $this->mode;
    }

    public function setMode(int $mode): self
    {
        $this->mode = $mode;

        return $this;
    }

    public function getDeliveryAddress(): ?int
    {
        return $this->deliveryAddress;
    }

    public function setDeliveryAddress(int $deliveryAddress): self
    {
        $this->deliveryAddress = $deliveryAddress;

        return $this;
    }

    public function getInvoiceAddress(): ?int
    {
        return $this->invoiceAddress;
    }

    public function setInvoiceAddress(int $invoiceAddress): self
    {
        $this->invoiceAddress = $invoiceAddress;

        return $this;
    }
}
