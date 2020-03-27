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
