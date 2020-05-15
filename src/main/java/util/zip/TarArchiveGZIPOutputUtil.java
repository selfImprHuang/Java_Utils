package util.zip;

import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream;
import org.apache.commons.compress.utils.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StopWatch;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.zip.GZIPOutputStream;

import static util.zip.PrintTool.calculateTimeAndLength;

/**
 * 总体思路
 * 1.将文件列表传入，通过tarArchiveOutputStream打包
 * 2.将tarArchiveOutputStream打包的文件，通过GZIPOutputStream进行压缩
 *
 * @author selfImpr
 * 参考地址：https://www.cnblogs.com/guochunyi/p/5311261.html
 */
public class TarArchiveGZIPOutputUtil {

    /**
     * 设定读入缓冲区尺寸
     */
    private static final byte[] BUF = new byte[1024];

    private static final int BUF_SIZE = 1024;

    private static final Logger LOGGER = LoggerFactory.getLogger(TarArchiveGZIPOutputUtil.class);

    private static final String GZ_SUFFIX = ".gz";


    /**
     * 根据传入的文件夹位置，打包对应的所有文件
     * @param dirPath 文件夹位置
     * @param zipFilePath 生成gz文件的位置
     * @return .tar.gz文件
     * @throws IOException io异常
     */
    static File compress(String dirPath, String zipFilePath) throws IOException {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        File dir = new File(dirPath);
        if (dir.exists() && dir.isDirectory()) {
            //遍历文件夹的所有文件
            File[] files = dir.listFiles();
            assert files != null;
            return compress(Arrays.asList(files), zipFilePath);
        }
        return null;
    }

    /**
     * 压缩成gzip格式,最后的文件格式为 tar.gz
     *
     * @param files 文件
     * @param tarPath 存储位置
     * @throws IOException Io异常
     * @return tar.gz结尾的文件
     */
    static File compress(List<File> files, String tarPath) throws IOException {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        //先进行打包
        packToTar(tarPath, files);
        //在进行压缩
        File file = compressToGz(tarPath);
        stopWatch.stop();

        //输出文件大小和运行时间
        calculateTimeAndLength(files.toArray(new File[]{}),stopWatch,file);
        return file;
    }

    /**
     * 只打包成tar文件，最后的格式为.tar
     *
     * @param files 文件
     * @param tarPath 存储位置
     * @throws IOException Io异常
     * @return tar结尾的文件
     */
    static File compressToTar(List<File> files, String tarPath) throws IOException {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        //先进行打包
        File file =  packToTar(tarPath, files);
        stopWatch.stop();
        //输出文件大小和运行时间
        calculateTimeAndLength(files.toArray(new File[]{}),stopWatch,file);
        return file;
    }

    /**
     * 根据地址找到所有的文件进行打包
     * @param dirPath 文件夹位置
     * @param tarFilePath 生成tar文件位置
     * @return .tar文件
     * @throws IOException io异常
     */
    static File compressToTar(String dirPath, String tarFilePath) throws IOException {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        File dir = new File(dirPath);
        if (dir.exists() && dir.isDirectory()) {
            //遍历文件夹的所有文件
            File[] files = dir.listFiles();
            assert files != null;
            return compressToTar(Arrays.asList(files), tarFilePath);
        }
        return null;
    }

    /**
     * 打包成tar格式
     *
     * @param tarPath 存储位置 这边传入的存储地址必须是.tar结尾的才会被转换成对应的格式，否则转换出来需要自己去重命名
     * @param files 文件
     * @throws IOException io异常
     * @return 返回打包对应的文件对象
     */
    private static File packToTar(String tarPath, List<File> files) throws IOException {
        //建立压缩文件输出流
        FileOutputStream fileOutputStream = new FileOutputStream(tarPath);
        TarArchiveOutputStream tarArchiveOutputStream = new TarArchiveOutputStream(fileOutputStream);
        FileInputStream fin = null;
        try {
            //建立tar压缩输出流
            for (File file : files) {
                //打开需压缩文件作为文件输入流
                fin = new FileInputStream(file);
                TarArchiveEntry tarEn = new TarArchiveEntry(file);
                //此处需重置名称，默认是带全路径的，否则打包后会带全路径
                tarEn.setName(file.getName());
                tarArchiveOutputStream.putArchiveEntry(tarEn);
                //IOUtils只是写入
                IOUtils.copy(fin, tarArchiveOutputStream);
                tarArchiveOutputStream.closeArchiveEntry();
                fin.close();
            }
            tarArchiveOutputStream.close();
            return new File(tarPath);
        } catch (IOException ex) {
            LOGGER.info("", ex);
        } finally {
            if (fin != null) {
                fin.close();
            }
            fileOutputStream.close();
        }
        return null;
    }

    /**
     * 压缩成GZIP格式
     *
     * @param tarPath 压缩路径
     * @throws IOException 压缩失败,文件路径找不到
     */
    private static File compressToGz(String tarPath) throws IOException {
        //建立压缩文件输出流
        String zipPath = tarPath + GZ_SUFFIX;
        FileOutputStream gzFileOutputStream = new FileOutputStream(zipPath);
        GZIPOutputStream gzipOutputStream = new GZIPOutputStream(gzFileOutputStream);
        FileInputStream tarFileInputStream = new FileInputStream(tarPath);
        try {
            //建立gzip压缩输出流,这个不能使用IOUtils的copy，可以具体看一下方法
            int len;
            while ((len = tarFileInputStream.read(BUF, 0, BUF_SIZE)) != -1) {
                gzipOutputStream.write(BUF, 0, len);
            }
            gzipOutputStream.close();
            return new File(zipPath);
        } catch (IOException e) {
            LOGGER.info("e");
        } finally {
            gzFileOutputStream.close();
            tarFileInputStream.close();
        }
        return null;
    }
}
