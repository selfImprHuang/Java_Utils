

package util;


import com.google.common.collect.Lists;
import entity.FileItem;
import org.springframework.util.CollectionUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Objects;

/**
 *
 * @author 志军
 */
public class FileUtil {

    private static final byte[] BUF = new byte[1024];

    private static final int BUF_SIZE = 1024;

    public static void deleteFile(String filePath) {
            File file = new File(filePath);
            if (!file.exists()) {
                throw new RuntimeException("文件不存在");
            }

            file.delete();
        }


    /**
     * 支持输入流存储到对应文件夹下，仅对文件夹有效
     * @param fileItems 输入流、文件名 数组
     * @param dirPath 文件夹路径
     */
    public static void storeFiles(List<FileItem> fileItems, String dirPath) {
        File file = new File(dirPath);
        if (!file.exists() && !file.isDirectory()) {
            file.mkdir();
        }

        fileItems.forEach(fileItem -> {
            File fileItemFile = new File(dirPath + File.separator + fileItem.getFileName());
            FileOutputStream fileOutputStream;

            try {
                //创建文件
                fileItemFile.createNewFile();
                fileOutputStream = new FileOutputStream(fileItemFile);
                int len;
                while ((len = fileItem.getInputStream().read(BUF, 0, BUF_SIZE)) != -1) {
                    fileOutputStream.write(BUF, 0, len);
                }

                fileOutputStream.close();
                fileItem.getInputStream().close();
            } catch (IOException e) {
               throw new RuntimeException("生成文件错误");
            }
        });
    }

    public static boolean fileExist(String filePath){
        File file = new File(filePath);
        return file.exists();
    }

    public static boolean  isFile(String filePath){
        File file = new File(filePath);
        if ( file.exists()){
            return file.isFile();
        }
        return false;
    }

    public static boolean isDir(String filePath){
        File file = new File(filePath);
        if ( file.exists()){
            return file.isDirectory();
        }
        return false;
    }

    /**
     * 文件已存在或者创建成功返回true
     * 文件不存在或者非文件（文件夹）或者创建失败，返回false
     */
    public static boolean createFile(String filePath){
        if(fileExist(filePath)){
            return isFile(filePath);
        }
        File file = new File(filePath);
        try {
            return file.createNewFile();
        } catch (IOException e) {
            return false;
        }
    }

    /**
     * 创建并获取一个File对象
     * 如果是文件、创建成功返回对应的文件对象
     * 其他情况直接返回null.
     */
    public static File createGetFile(String filePath){
        if(fileExist(filePath)){
            if ( isFile(filePath)){
                return new File(filePath);
            }
        }
        File file = new File(filePath);
        try {
            boolean result = file.createNewFile();
            if (result){
                return file;
            }
        } catch (IOException e) {
            return null;
        }
        return null;
    }

    /**
     * 文件转换成byte数组
     */
    public static byte[] fileToByte(String filePath) {
        FileInputStream in = null;
        try {
            in = new FileInputStream(new File(filePath));
            byte[] bytes = new byte[in.available()];
            in.read(bytes);
            return bytes;
        } catch (IOException e) {
           throw new RuntimeException("转换失败",e);
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * byte数组写入文件
     */
    public static void bytesToFile(String filePath,byte[] content){
        FileOutputStream out = null;
        try {
            out = new FileOutputStream(new File(filePath));
            out.write(content);
            out.flush();
        } catch (IOException e) {
            throw new RuntimeException("写入失败",e);
        } finally {
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }


    /**
     * 拿到文件夹下面的所有文件夹(包括它自己)
     */
    public static List<File> findAllDirFromDir(String dirPath){
        File dir = new File(dirPath);
        if(!dir.exists() || !dir.isDirectory()){
            throw new RuntimeException("非文件夹或者文件夹位置错误");
        }
        List<File> result = findDir(dir);
        result.add(dir);
        return result;
    }

    private static List<File> findDir(File file ){
        List<File> list = Lists.newArrayList();
        for(File child : Objects.requireNonNull(file.listFiles())){
            if(child.isDirectory()){
                list.add(child);
                List<File> tempList = findDir(child);
                if(!CollectionUtils.isEmpty(tempList)){
                    list.addAll(tempList);
                }
            }
        }
        return list;
    }


    /**
     * 拿到文件夹下面的所有空文件夹
     */
    public static List<File> findAllEmptyDirFromDir( String dirPath){
        List<File> list = Lists.newArrayList();
        File dir = new File(dirPath);
        if(!dir.exists() || !dir.isDirectory()){
            throw new RuntimeException("非文件夹或者文件夹位置错误");
        }
        List<File> allList =  findAllDirFromDir(dirPath);
        for(File dirFile:allList){
            if(isEmptyFile(dirFile)){
                list.add(dirFile);
            }
        }
        return list;
    }


    /**
     * 通过目录获取目录下所有的文件
     */
    public static List<File> findAllFile(File dir){
        List<File> list = Lists.newArrayList();
        for (File file : Objects.requireNonNull(dir.listFiles())){
            if(file.isFile()){
                list.add(file);
            }else{
                List<File> tempList = findAllFile(file);
                if(!CollectionUtils.isEmpty(tempList)){
                    list.addAll(tempList);
                }
            }
        }
        return list;
    }

    private static boolean isEmptyFile(File dir) {
        List<File> child = findAllFile(dir);
        return  CollectionUtils.isEmpty(child);
    }


    /**
     * 拿到文件夹下面的所有非空文件夹
     */
    public static List<File> findAllNotEmptyDirFromDir( String dirPath){
        List<File> list = Lists.newArrayList();
        File dir = new File(dirPath);
        if(!dir.exists() || !dir.isDirectory()){
            throw new RuntimeException("非文件夹或者文件夹位置错误");
        }
        List<File> allList =  findAllDirFromDir(dirPath);
        for(File dirFile:allList){
            if(!isEmptyFile(dir)){
                list.add(dirFile);
            }
        }
        return list;
    }
}
