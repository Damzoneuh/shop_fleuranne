<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\CategoryChild;
use App\Entity\Img;
use App\Entity\Item;
use App\Entity\Mark;
use App\Helper\FileHelper;
use App\Helper\Serializer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ItemController extends AbstractController
{
    use Serializer;
    use \App\Helper\Item;
    use FileHelper;

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route("/admin/api/create/category", name="admin_api_create_category", methods={"POST"})
     */
    public function createCategory(Request $request){
        $data = $this->decode($request->getContent(), 'json');
        $em = $this->getDoctrine()->getManager();
        $category = new Category();
        $category->setName($data['name']);
        $em->persist($category);
        $em->flush();

        return $this->json(['success' => 'La catégorie à été ajoutée']);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route("/admin/api/create/categorychild", name="admin_api_create_category_child", methods={"POST"})
     */
    public function createCategoryChild(Request $request){
        $data =  $this->decode($request->getContent(), 'json');
        $em = $this->getDoctrine()->getManager();
        $child = new CategoryChild();
        $child->setName($data['name']);
        $child->setCategory($em->getRepository(Category::class)->find($data['category']));
        $em->persist($child);
        $em->flush();

        return $this->json(['success' => 'La sous catégorie à été ajoutée']);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route("/admin/api/create/item", name="admin_api_create_item", methods={"POST"})
     * @throws \Exception
     */
    public function createItem(Request $request){
        /** @var UploadedFile $file */
        $file = $request->files->get('file');
        $filename = $this->generateFileName() . '.' . $file->getClientOriginalExtension();
        $img = new Img();
        $path = $this->getParameter('storage') . '/' . $filename;
        $image = $this->createImg($img, $file, $path);
        $this->moveFile($file, $path, $filename);

        $item = $this->createItemPayload(
            new Item(),
            $request->get('categoryChild'),
            $request->get('category'),
            $this->decode($request->get('payload'), 'json'),
            'new'
        );

        $em = $this->getDoctrine()->getManager();
        $em->persist($item);
        $image->setItem($item);
        $em->flush();

        return $this->json(['success' => 'Le produit à bien été ajouté']);
    }

    /**
     * @param $id
     * @return JsonResponse
     * @Route("/admin/api/delete/mark/{id}", name="admin_api_delete_mark", methods={"DELETE"})
     */
    public function deleteMark($id){
        $em = $this->getDoctrine()->getManager();
        $mark = $this->getDoctrine()->getRepository(Mark::class)->find($id);
        $img = $this->getDoctrine()->getRepository(Img::class)->find($mark->getImg()->getId());
        $this->removeFile($img->getPath());
        $em->remove($mark);
        $em->remove($img);
        $em->flush();

        return $this->json(['success' => 'L\'image à bien été supprimée']);
    }

    /**
     * @Route("/img/{id}", name="img")
     * @param $id
     * @return BinaryFileResponse
     */
    public function index($id)
    {
        $img = $this->getDoctrine()->getRepository(Img::class)->find($id);
        return $this->file($img->getPath());
    }

    /**
     * @param Request $request
     * @Route("/admin/api/mark/img", name="admin_api_mark_img", methods={"POST"})
     * @return JsonResponse
     * @throws \Exception
     */
    public function uploadImageForMark(Request $request){
        /** @var UploadedFile $file */
        $file = $request->files->get('file');
        $name = $request->get('name');
        $em = $this->getDoctrine()->getManager();
        $fileName = $this->generateFileName().'.'.$file->getClientOriginalExtension();

        $img = new Img();
        $mark = new Mark();

        $path = $this->getParameter('storage');
        $this->moveFile($file, $path, $fileName);

        $mark->setName($name);
        $img->setName($file->getClientOriginalName());
        $img->setPath($path. '/' . $fileName);
        $em->persist($img);
        $mark->setImg($img);
        $em->persist($mark);
        $em->flush();

        return $this->json(['success' => 'La marque à bien été ajoutée']);
    }

    /**
     * @param null $id
     * @return JsonResponse
     * @Route("/api/mark/{id}", name="admin_api_get_mark", methods={"GET"})
     */
    public function getMarks($id = null){
        if ($id){
            return $this->json($this->getDoctrine()->getRepository(Mark::class)->find($id));
        }
        return $this->json($this->getDoctrine()->getRepository(Mark::class)->findAll());
    }

    /**
     * @param null $id
     * @return JsonResponse
     * @Route("/api/item/{id}", name="api_item", methods={"GET"})
     */
    public function getItem($id = null){
        if ($id){
            return $this->json($this->getDoctrine()->getRepository(Item::class)->find($id));
        }
        return $this->json($this->getDoctrine()->getRepository(Item::class)->findAll());
    }

    /**
     * @param null $id
     * @return JsonResponse
     * @Route("/api/category/{id}", name="api_category", methods={"GET"})
     */
    public function getCategories($id = null){
        if ($id){
            return $this->json($this->getDoctrine()->getRepository(Category::class)->findOneCategory($id));
        }
        return $this->json($this->getDoctrine()->getRepository(Category::class)->getCategories());
    }

    /**
     * @param null $id
     * @return JsonResponse
     * @Route("/api/child/category/{id}", name="api_child_category", methods={"GET"})
     */
    public function getChildCategories($id = null){
        if ($id){
            return $this->json($this->getDoctrine()->getRepository(CategoryChild::class)->findOneSubCategory($id));
        }
        return $this->json($this->getDoctrine()->getRepository(CategoryChild::class)->getAllSubCategories());
    }

    /**
     * @param $id
     * @return JsonResponse
     * @Route("/api/category/child/{id}", name="api_category_from_child", methods={"GET"})
     */
    public function getChildFromCategory($id){
        return $this->json($this->getDoctrine()->getRepository(CategoryChild::class)->getSubFromOneCategory($id));
    }
}
