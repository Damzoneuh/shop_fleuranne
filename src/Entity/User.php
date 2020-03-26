<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isValidated;

    /**
     * @ORM\Column(type="boolean")
     */
    private $newsletter;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $resetToken;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Address", mappedBy="invoiceAddress")
     */
    private $invoiceAdress;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Address", mappedBy="deliveryAddress")
     */
    private $deliveryAddress;

    public function __construct()
    {
        $this->invoiceAdress = new ArrayCollection();
        $this->deliveryAddress = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getIsValidated(): ?bool
    {
        return $this->isValidated;
    }

    public function setIsValidated(bool $isValidated): self
    {
        $this->isValidated = $isValidated;

        return $this;
    }

    public function getNewsletter(): ?bool
    {
        return $this->newsletter;
    }

    public function setNewsletter(bool $newsletter): self
    {
        $this->newsletter = $newsletter;

        return $this;
    }

    public function getResetToken(): ?string
    {
        return $this->resetToken;
    }

    public function setResetToken(?string $resetToken): self
    {
        $this->resetToken = $resetToken;

        return $this;
    }

    /**
     * @return Collection|Address[]
     */
    public function getInvoiceAdress(): Collection
    {
        return $this->invoiceAdress;
    }

    public function addInvoiceAdress(Address $invoiceAdress): self
    {
        if (!$this->invoiceAdress->contains($invoiceAdress)) {
            $this->invoiceAdress[] = $invoiceAdress;
            $invoiceAdress->setInvoiceAddress($this);
        }

        return $this;
    }

    public function removeInvoiceAdress(Address $invoiceAdress): self
    {
        if ($this->invoiceAdress->contains($invoiceAdress)) {
            $this->invoiceAdress->removeElement($invoiceAdress);
            // set the owning side to null (unless already changed)
            if ($invoiceAdress->getInvoiceAddress() === $this) {
                $invoiceAdress->setInvoiceAddress(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Address[]
     */
    public function getDeliveryAddress(): Collection
    {
        return $this->deliveryAddress;
    }

    public function addDeliveryAddress(Address $deliveryAddress): self
    {
        if (!$this->deliveryAddress->contains($deliveryAddress)) {
            $this->deliveryAddress[] = $deliveryAddress;
            $deliveryAddress->setDeliveryAddress($this);
        }

        return $this;
    }

    public function removeDeliveryAddress(Address $deliveryAddress): self
    {
        if ($this->deliveryAddress->contains($deliveryAddress)) {
            $this->deliveryAddress->removeElement($deliveryAddress);
            // set the owning side to null (unless already changed)
            if ($deliveryAddress->getDeliveryAddress() === $this) {
                $deliveryAddress->setDeliveryAddress(null);
            }
        }

        return $this;
    }
}
