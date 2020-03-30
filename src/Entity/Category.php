<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CategoryRepository")
 */
class Category
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @MaxDepth(4)
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\CategoryChild", mappedBy="category")
     */
    private $child;

    public function __construct()
    {
        $this->child = new ArrayCollection();
    }

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

    /**
     * @return Collection|CategoryChild[]
     */
    public function getChild(): Collection
    {
        return $this->child;
    }

    public function addChild(CategoryChild $child): self
    {
        if (!$this->child->contains($child)) {
            $this->child[] = $child;
            $child->setCategory($this);
        }

        return $this;
    }

    public function removeChild(CategoryChild $child): self
    {
        if ($this->child->contains($child)) {
            $this->child->removeElement($child);
            // set the owning side to null (unless already changed)
            if ($child->getCategory() === $this) {
                $child->setCategory(null);
            }
        }

        return $this;
    }
}
