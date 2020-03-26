<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ServicesRepository")
 */
class Services
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $description;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Mark")
     * @ORM\JoinColumn(nullable=false)
     */
    private $mark;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\CareType")
     * @ORM\JoinColumn(nullable=false)
     */
    private $care;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $time;

    /**
     * @ORM\Column(type="float")
     */
    private $priceWoman;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $priceMan;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getMark(): ?Mark
    {
        return $this->mark;
    }

    public function setMark(?Mark $mark): self
    {
        $this->mark = $mark;

        return $this;
    }

    public function getCare(): ?CareType
    {
        return $this->care;
    }

    public function setCare(?CareType $care): self
    {
        $this->care = $care;

        return $this;
    }

    public function getTime(): ?string
    {
        return $this->time;
    }

    public function setTime(?string $time): self
    {
        $this->time = $time;

        return $this;
    }

    public function getPriceWoman(): ?float
    {
        return $this->priceWoman;
    }

    public function setPriceWoman(float $priceWoman): self
    {
        $this->priceWoman = $priceWoman;

        return $this;
    }

    public function getPriceMan(): ?float
    {
        return $this->priceMan;
    }

    public function setPriceMan(?float $priceMan): self
    {
        $this->priceMan = $priceMan;

        return $this;
    }
}
