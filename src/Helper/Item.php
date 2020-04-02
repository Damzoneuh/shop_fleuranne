<?php


namespace App\Helper;


use App\Entity\CategoryChild;
use App\Entity\Mark;

trait Item
{
    public function createItemPayload(\App\Entity\Item $item,CategoryChild $categoryChild, Mark $mark, $data, $type){
        $item->setName($data['name']);
        $item->setDescription($data['description']);
        $item->setPrice($data['price']);
        $item->setProm($data['prom']);
        $item->setRef($data['ref']);
        $item->setCategoryChild($categoryChild);
        $item->setMark($mark);
        if ($type == 'new'){
            $item->setCreatedAt(new \DateTime('now'));
        }
        $item->setUpdatedAt(new \DateTime('now'));
        return $item;
    }
}