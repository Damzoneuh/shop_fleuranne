<?php


namespace App\Helper;


use App\Entity\Img;
use Exception;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;

trait FileHelper
{
    /**
     * @return string
     * @throws Exception
     */
    public function generateFileName(){
       return bin2hex(random_bytes(16));
    }

    public function createImg(Img $img, UploadedFile $file, $path) : Img{
        $img->setName($file->getClientOriginalName());
        $img->setPath($path);
        return $img;
    }

    public function moveFile(UploadedFile $file, $path, $fileName) : void{
        $file->move($path, $fileName);
    }

    public function removeFile($path) : void {
        $fs = new Filesystem();
        $fs->remove($path);
    }
}