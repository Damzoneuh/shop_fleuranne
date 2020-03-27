<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ItemRepository")
 */
class Item
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
    private $ref;

    /**
     * @ORM\Column(type="float")
     */
    private $price;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $desctiption;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $prom;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Img", mappedBy="item")
     */
    private $img;

    public function __construct()
    {
        $this->img = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRef(): ?string
    {
        return $this->ref;
    }

    public function setRef(string $ref): self
    {
        $this->ref = $ref;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getDesctiption(): ?string
    {
        return $this->desctiption;
    }

    public function setDesctiption(?string $desctiption): self
    {
        $this->desctiption = $desctiption;

        return $this;
    }

    public function getProm(): ?int
    {
        return $this->prom;
    }

    public function setProm(?int $prom): self
    {
        $this->prom = $prom;

        return $this;
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

    /**
     * @return Collection|Img[]
     */
    public function getImg(): Collection
    {
        return $this->img;
    }

    public function addImg(Img $img): self
    {
        if (!$this->img->contains($img)) {
            $this->img[] = $img;
            $img->setItem($this);
        }

        return $this;
    }

    public function removeImg(Img $img): self
    {
        if ($this->img->contains($img)) {
            $this->img->removeElement($img);
            // set the owning side to null (unless already changed)
            if ($img->getItem() === $this) {
                $img->setItem(null);
            }
        }

        return $this;
    }
}
