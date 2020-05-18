package util.image;

import util.FileUtil;

import java.io.IOException;

public class JpegImagerUtilTest {

    public static void main(String[] args) throws IOException {
        PicturesCompressUtil picturesCompressUtil = new PicturesCompressUtil();
        picturesCompressUtil.compress("F:\\Java个人代码\\Java_Utils\\src\\main\\test\\util\\image\\JpegImager\\2002013.jpg","F:\\Java个人代码\\Java_Utils\\src\\main\\test\\util\\image\\JpegImager\\2002013_copy.jpg");
        System.out.println("压缩之后的大小差别为");
        byte[] b1 = FileUtil.fileToByte("F:\\Java个人代码\\Java_Utils\\src\\main\\test\\util\\image\\JpegImager\\2002013.jpg");
        byte[] b2 = FileUtil.fileToByte("F:\\Java个人代码\\Java_Utils\\src\\main\\test\\util\\image\\JpegImager\\2002013_copy.jpg");
        System.out.println("压缩前后字节差：" + (b1.length - b2.length+ " byte"));
    }
}
