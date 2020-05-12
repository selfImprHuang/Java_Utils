

package util;


import entity.FileItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

/**
 * 网宿业务--日志下载
 *
 * @author huangzj1
 */
public class FileUtil {

    private static final Logger LOGGER = LoggerFactory.getLogger(FileUtil.class);

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
}
