package util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 这个就是一个储备的工作工具，不具备学习的用处，反正我是学不来
 * 参考网上的地址：http://tools.jb51.net/regex/create_reg
 * https://www.jb51.net/article/115170.htm
 *
 * @author 志军
 */
public class PatternUtils {

    /**
     *  全是中文
     */
    private static final String ALL_CHINESS_PATTERN = "[\\u4e00-\\u9fa5]+";

    /**
     * 是不是E-mail地址
     */
    private static final String EMAIL_ADDRESS_PATTERN = "\\w[-\\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\\.)+[A-Za-z]{2,14}";

    /**
     * 是不是网址
     *
     */
    private static final String INTERNET_URL_PATTERN = "^((https|http|ftp|rtsp|mms)?:\\/\\/)[^\\s]+";

    /**
     *  2018目前国内的手机
     */
    private static final String MOBILE_PHONE_PATTERN = "/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$/";

    /**
     * 2018目前国内的电话
     */
    private static final String TEL_PHONE_PATTERN = "[0-9-()（）]{7,18}";

    /**
     * qq号码
     */
    private static final String QQ_PATTERN = "[1-9]([0-9]{5,11})";

    /**
     * 邮政编码
     */
    private static final String POSTAL_CODE_PATTERN = "\\d{6}";

    /**
     *  身份证，验证15位和18位
     *  https://www.jb51.net/article/109384.htm
     */
    private static final String ID_CARD_PATTERN = " ^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)"
        + "\\d{3}[0-9Xx]$)|(^[1-9]\\d{5}\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{2}$";

    /**
     * IPv4地址正则
     */
    private static final String IPV4_PATTERN = "/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}"
        + "(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/";

    /**
     * 微信号,6至20位，以字母开头，字母，数字，减号，下划线
     */
    private static final String WEIXIN_PATTERN = "/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/";

    /**
     * 车牌号
     */
    private static final String LICENSE_PLATE_PATTERN = " /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/";

    /**
     * 日期正则，复杂判定
     */
    private static final String DATE_PATTERN = "/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-"
        + "(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/";

    /**
     * 用户名正则，，4到16位（字母，数字，下划线，减号）
     */
    private static final String USER_NAME_PATTERN = "/^[a-zA-Z0-9_-]{4,16}$/";

    /**
     * 密码正则 最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
     */
    private static final String PASSWORD_PATTERN = "/^.*(?=.{6,})(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/";

    /**
     * 文件路径及拓展名校验
     */
    private static final String FILE_PATH_PATTERN = "([a-zA-Z]\\\\:|\\\\\\\\)\\\\\\\\([^\\\\\\\\]+\\\\\\\\)*[^\\\\/:*?\"<>|]+\\\\.txt(l)?$";

    /**
     * 这边就不一一写出来了，以后要用的时候再说
     *
     */
    private static boolean commonPattern(String pattern, String str) {
        Pattern r = Pattern.compile(pattern);
        Matcher m = r.matcher(str);
        return m.matches();
    }

}
