<?php

namespace App\Repository;

use App\Entity\CareType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method CareType|null find($id, $lockMode = null, $lockVersion = null)
 * @method CareType|null findOneBy(array $criteria, array $orderBy = null)
 * @method CareType[]    findAll()
 * @method CareType[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CareTypeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CareType::class);
    }

    // /**
    //  * @return Mark[] Returns an array of Mark objects
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
    public function findOneBySomeField($value): ?Mark
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
