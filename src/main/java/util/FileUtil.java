

package util;


import entity.FileItem;

import java.io.*;
import java.util.List;

/**
 * 网宿业务--日志下载
 *
 * @author huangzj1
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
            BufferedWriter writer = null;
            FileOutputStream fileOutputStream = null;

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
                e.printStackTrace();
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
}
