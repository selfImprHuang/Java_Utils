

package util.zip;

import org.apache.commons.compress.utils.IOUtils;
import org.springframework.util.StopWatch;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static util.zip.PrintTool.calculateTimeAndLength;

/**
 * 压缩成ZIP文件，这边主要是通过 zipOutputStream 这个类进行对应的实现，所以其实也算是一个使用的实现例子
 * @author 黄志军
 */
class ZipOutputUtil {
    /**
     * @param originPath 此方法只压缩文件夹
     * @param zipFilePath 压缩文件的路径
     * @return 压缩之后的文件对象
     */
    static File compress(String originPath, String zipFilePath) throws IOException {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        File dir = new File(originPath);
        if (dir.exists() && dir.isDirectory()) {
            //遍历文件夹的所有文件
            File[] files = dir.listFiles();
            assert files != null;
            //进行ZipOutputStream的压缩操作
            File file = compress(files, zipFilePath);
            stopWatch.stop();
            //输出文件大小和运行时间
            calculateTimeAndLength(files,stopWatch,file);
            return file;
        }
        System.out.println("文件夹不存在或者非文件夹");
        return null;
    }




    private static File compress(File[] files, String zipFilePath) throws IOException {
        File zipFile = new File(zipFilePath);
        // 文件输出流
        FileOutputStream outputStream = new FileOutputStream(zipFile);
        // 压缩流
        ZipOutputStream zipOutputStream = new ZipOutputStream(outputStream);
        for (File file : files) {
            FileInputStream inputStream = new FileInputStream(file);
            ZipEntry zipEntry = new ZipEntry(file.getName());
            zipOutputStream.putNextEntry(zipEntry);
            IOUtils.copy(inputStream, zipOutputStream);
            inputStream.close();
            zipOutputStream.closeEntry();
        }
        zipOutputStream.close();
        outputStream.close();
        return zipFile;
    }
}
