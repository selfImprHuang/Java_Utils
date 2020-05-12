
package util.http;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Spring 返回前端对象，主要用于文件下载
 * @author huangzj
 */
public class ResponseEntityUtil {

    public static ResponseEntity getResponseEntity(File file, String fileName) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=\"" + fileName + "\";");
        headers.add(HttpHeaders.EXPIRES, "0");
        headers.add(HttpHeaders.LAST_MODIFIED, new Date().toString());
        headers.add(HttpHeaders.ETAG, String.valueOf(System.currentTimeMillis()));

        return ResponseEntity.ok().headers(headers).contentLength(file.length()).contentType(MediaType.APPLICATION_OCTET_STREAM).body(new
            FileSystemResource(file));
    }


    public static String processFileName(HttpServletRequest request, String fileName) throws UnsupportedEncodingException {
        //火狐和其他浏览器好像有区别
        if (request.getHeader(HttpHeaders.USER_AGENT).toUpperCase().indexOf("MSIE") > 0) {
            fileName = URLEncoder.encode(fileName, "UTF-8");
        } else {
            fileName = new String(fileName.getBytes(StandardCharsets.UTF_8), "ISO8859-1");
        }
        return fileName;
    }

    // headers.add("Pragma", "no-cache");
    // headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
}
