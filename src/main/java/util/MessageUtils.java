package util;

import org.slf4j.helpers.MessageFormatter;

import java.text.MessageFormat;

/**
 * Created by huangzj on 2017/8/21.
 * @author 志军
 */
public class MessageUtils {
    /**
     * 格式化信息，支持message={0}或message={}格式的信息模板。
     *
     * @param pattern 信息模板
     * @param parameters 参数值
     * @return 格式化后的信息
     */
    public static String format(String pattern, Object... parameters) {
        try {
            return MessageFormat.format(pattern, parameters);
        } catch (IllegalArgumentException e) {
            //上面的MessageFormat报错进来这边的，这边的测试只测试出当格式不正确的情况才会进来
            return MessageFormatter.arrayFormat(pattern, parameters).getMessage();
        }
    }
}
