/*
 * @(#) TestGzip
 * 版权声明 网宿科技, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2018
 * <br> Company:网宿科技
 * <br> @author Administrator
 * <br> @description 功能描述
 * <br> 2018-11-09 20:30:59
 */

package util.zip;

import com.google.common.collect.Lists;
import entity.FileItem;
import org.springframework.util.StopWatch;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import util.FileUtil;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.UUID;


/**
 * 关联WS业务--日志下载
 * 参考地址：https://www.cnblogs.com/guochunyi/p/5311261.html
 */
public class ZipTest {


    public static void main(String[] args) throws IOException {
        //这边的测试我没有放入对应的文件，因为太大了，所以如果想要测试，需要在相应的目录放入对应带下的文件才能进行测试...
        testGzip();
    }

    public static void testGzip() throws IOException {
        String Path1M = ZipTest.class.getClassLoader().getResource("/test/testDownload").getPath();
        String path10M = ZipTest.class.getClassLoader().getResource("/test/test10M").getPath();
        String path100M = ZipTest.class.getClassLoader().getResource("/test/test100M").getPath();
        String path1000M = ZipTest.class.getClassLoader().getResource("/test/test1000M").getPath();
        System.out.println("测试1M数据的压缩时间");
        for (int i = 0; i < 3; i++) {
            testGzipOnce(Path1M);
        }
        System.out.println("测试10M数据的压缩时间");
        for (int i = 0; i < 3; i++) {
            testGzipOnce(path10M);
        }
        System.out.println("测试100M数据的压缩时间");
        for (int i = 0; i < 3; i++) {
            testGzipOnce(path100M);
        }
        System.out.println("测试1000M数据的压缩时间");
        for (int i = 0; i < 3; i++) {
            testGzipOnce(path1000M);
        }

        System.out.println("测试1M数据的压缩时间");
        for (int i = 0; i < 3; i++) {
            testZipOnce(Path1M);
        }
        System.out.println("测试10M数据的压缩时间");
        for (int i = 0; i < 3; i++) {
            testZipOnce(path10M);
        }
        System.out.println("测试100M数据的压缩时间");
        for (int i = 0; i < 3; i++) {
            testZipOnce(path100M);
        }
        System.out.println("测试1000M数据的压缩时间");
        for (int i = 0; i < 3; i++) {
            testZipOnce(path1000M);
        }
    }


    private static void testZipOnce(String path) throws IOException {
        String filePath = ZipTest.class.getClassLoader().getResource("/test").getPath();
        File packageFile = new File(filePath + UUID.randomUUID().toString().replaceAll("-", ""));
        packageFile.mkdir();
        String zPath = packageFile.getPath() + File.separator + UUID.randomUUID().toString().replaceAll("-", "") + ".zip";
        new File(zPath).createNewFile();

        File file = ZipOutputUtil.compress(path, zPath);
        System.out.println(file.getName());
    }

    private static void testGzipOnce(String path) throws IOException {
        String filePath = ZipTest.class.getClassLoader().getResource("/test").getPath();
        File packageFile = new File(filePath + UUID.randomUUID().toString().replaceAll("-", ""));
        packageFile.mkdir();
        String tarPath = packageFile.getPath() + File.separator + UUID.randomUUID().toString().replaceAll("-", "") + ".tar";
        String gzPath = packageFile.getPath() + File.separator + UUID.randomUUID().toString().replaceAll("-", "") + ".gz";
        new File(gzPath).createNewFile();
        List<File> files = Lists.newArrayList();
        File file = new File(path);
        File[] file1 = file.listFiles();
        for (File file2 : file1) {
            files.add(file2);
        }
        File filex = TarArchiveGZIPOutputUtil.compress(files, tarPath);
        System.out.println(filex.getName());
    }

    @RequestMapping(value = "/testFile1", method = RequestMethod.POST)
    public void testFile1() throws FileNotFoundException {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        String filePath = ZipTest.class.getClassLoader().getResource("/test").getPath();
        File packageFile = new File(filePath + UUID.randomUUID().toString().replaceAll("-", ""));
        packageFile.mkdir();

        String path = ZipTest.class.getClassLoader().getResource("/test/testgzip").getPath();
        File file = new File(path);
        File[] files = file.listFiles();
        List<FileItem> fileItems = Lists.newArrayList();

        for (File file1 : files) {
            FileItem fileItem = new FileItem();
            fileItem.setInputStream(new FileInputStream(file1));
            fileItem.setFileName(file1.getName());
            fileItems.add(fileItem);
        }

        FileUtil.storeFiles(fileItems, packageFile.getPath());
        stopWatch.stop();
        System.out.println(stopWatch.getTotalTimeMillis() / 1000.0000 + " s");
    }
}
