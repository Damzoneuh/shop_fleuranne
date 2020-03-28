<?php

namespace App\Repository;

use App\Entity\CategoryChild;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method CategoryChild|null find($id, $lockMode = null, $lockVersion = null)
 * @method CategoryChild|null findOneBy(array $criteria, array $orderBy = null)
 * @method CategoryChild[]    findAll()
 * @method CategoryChild[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CategoryChildRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CategoryChild::class);
    }

    public function findOneSubCategory($id){
        return $this->createQueryBuilder('sc')
            ->where('sc.id=:id')
            ->setParameter('id', $id)
            ->orderBy('sc.id', 'ASC')
            ->select(['sc.id', 'sc.name'])
            ->getQuery()
            ->getResult();
    }

    public function getAllSubCategories(){
        return $this->createQueryBuilder('sc')
            ->select(['sc.id', 'sc.name'])
            ->orderBy('sc.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function getSubFromOneCategory($id){
        return $this->createQueryBuilder('sc')
            ->innerJoin('App\\Entity\\Category', 'c')
            ->where('c.id =:id')
            ->andWhere('sc.category = c.id')
            ->setParameter('id', $id)
            ->select(['sc.name', 'sc.id'])
            ->getQuery()
            ->getResult();
    }

    // /**
    //  * @return CategoryChild[] Returns an array of CategoryChild objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?CategoryChild
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
