package util;

import java.io.File;

public class FileUtilTest {

    public static void main(String[] args) {
        System.out.println(FileUtil.isFile("F:\\Java个人代码\\Java_Utils\\src\\main\\test\\emptyDirTest\\1\\11.txt"));
        System.out.println(FileUtil.isDir("F:\\Java个人代码\\Java_Utils\\src\\main\\test\\emptyDirTest"));
//        for(File file:FileUtil.findAllDirFromDir("F:\\Java个人代码\\Java_Utils\\src\\main\\test\\emptyDirTest")){
//            System.out.println(file.getName());
//        }

        System.out.println("===================================");
        for(File file:FileUtil.findAllEmptyDirFromDir("F:\\Java个人代码\\Java_Utils\\src\\main\\test\\emptyDirTest")){
            System.out.println(file.getName());
        }
//
//        System.out.println("===================================");
//        for(File file:FileUtil.findAllFile(new File("F:\\Java个人代码\\Java_Utils\\src\\main\\test\\emptyDirTest"))){
//            System.out.println(file.getName());
//        }
//
//
        System.out.println("===================================");
        for(File file:FileUtil.findAllNotEmptyDirFromDir("F:\\Java个人代码\\Java_Utils\\src\\main\\test\\emptyDirTest")){
            System.out.println(file.getName());
        }
    }
}
