

package util;

import org.apache.log4j.Logger;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * 调用shell命令
 */
public class ShellUtils {

    private static final Logger LOGGRE = Logger.getLogger(ShellUtils.class);

    /**
     * 压缩文件
     * @param originPath 源文件位置
     * @param tarPath 新文件位置
     */
    public void compressFile(String originPath, String tarPath) {
        InputStream in = null;
        try {
            Process cd = Runtime.getRuntime().exec(new String[]{"cd", " ", originPath});
            cd.waitFor();
            Process pro = Runtime.getRuntime().exec(new String[]{"tar", " -czf", tarPath, "*.tar.gz"});
            pro.waitFor();
            in = pro.getInputStream();
            BufferedReader read = new BufferedReader(new InputStreamReader(in));
            String result = read.readLine();
            LOGGRE.info("shell compress result : " + result);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void deleteFile(String tempPathOnTime) {
        InputStream in = null;
        try {
            Process pro = Runtime.getRuntime().exec(new String[]{"rm", "-rf", " ", tempPathOnTime});
            pro.waitFor();
            in = pro.getInputStream();
            BufferedReader read = new BufferedReader(new InputStreamReader(in));
            String result = read.readLine();
            LOGGRE.info("shell delete result : " + result);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
