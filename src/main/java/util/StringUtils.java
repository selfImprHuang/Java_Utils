/*
 * @(#) StringUtils
 * 版权声明 网宿科技, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2018
 * <br> Company:网宿科技
 * <br> @author Administrator
 * <br> @description 功能描述
 * <br> 2018-10-07 17:13:13
 */

package util;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.HanyuPinyinVCharType;
import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author 志军
 * 补充Strings的缺失
 */
class StringUtils {

    private static char A_LETTER = 'a';
    private static char Z_LETTER = 'z';
    private static Pattern p = Pattern.compile("[\u4e00-\u9fa5]");

    /**
     * 首字母小写
     */
    static String lowerFirstLetter(String word) {
        char[] chars = word.toCharArray();
        if (chars[0] >= A_LETTER && chars[0] <= Z_LETTER) {
            chars[0] += 32;
        }

        return String.valueOf(chars);
    }

    /**
     * 首字母大写
     */
    static String upperFirstLetter(String word) {
        char[] chars = word.toCharArray();
        if (chars[0] >= A_LETTER && chars[0] <= Z_LETTER) {
            chars[0] -= 32;
        }

        return String.valueOf(chars);
    }

    static String upperAllLetter(String word){
        StringBuilder stringBuilder = new StringBuilder();
        char[] chars = word.toCharArray();
        for( int i= 0;i<chars.length;i++){
            if (chars[0] >= A_LETTER && chars[0] <= Z_LETTER) {
                chars[0] -= 32;
            }
            stringBuilder.append(chars[i]);
        }
        return stringBuilder.toString();
    }

    static String lowerAllLetter(String word) {
        StringBuilder stringBuilder = new StringBuilder();
        char[] chars = word.toCharArray();
        for( int i= 0;i<chars.length;i++){
            if (chars[0] >= A_LETTER && chars[0] <= Z_LETTER) {
                chars[0] += 32;
            }
            stringBuilder.append(chars[i]);
        }
        return stringBuilder.toString();
    }


    static  String appendAll(String... word){
        StringBuilder stringBuilder = new StringBuilder();
        for (String aWord : word) {
            stringBuilder.append(aWord);
        }
        return stringBuilder.toString();
    }


    /**
     * 判断字符串中是否包含中文
     */
    static boolean isContainChinese(String str) {
        Matcher m = p.matcher(str);
        return m.find();
    }


    /**
     * 校验一个字符是否是汉字
     */
    static boolean isChineseChar(char c) {
        try {
            return String.valueOf(c).getBytes(StandardCharsets.UTF_8).length > 1;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    static String toPinyinUpper(String word) throws BadHanyuPinyinOutputFormatCombination {
        StringBuilder stringBuilder = new StringBuilder();
        HanyuPinyinOutputFormat format = new HanyuPinyinOutputFormat();
        format.setCaseType(HanyuPinyinCaseType.UPPERCASE);
        format.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
        char[] chars = word.toCharArray();
        buildChars(chars,stringBuilder,format);
        return stringBuilder.toString();
    }

    static String toPinyinLower(String word) throws BadHanyuPinyinOutputFormatCombination {
        StringBuilder stringBuilder = new StringBuilder();
        HanyuPinyinOutputFormat format = new HanyuPinyinOutputFormat();
        format.setCaseType(HanyuPinyinCaseType.LOWERCASE);
        format.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
        char[] chars = word.toCharArray();
        buildChars(chars,stringBuilder,format);
        return stringBuilder.toString();
    }


    private static void buildChars(char[] chars,StringBuilder stringBuilder,HanyuPinyinOutputFormat format) throws BadHanyuPinyinOutputFormatCombination {
        for (char aChar : chars) {
            if (isChineseChar(aChar)) {
                String[] result = PinyinHelper.toHanyuPinyinStringArray(aChar, format);
                for(String s : result){
                    stringBuilder.append(s);
                }
                continue;
            }
            //处理非中文的部分
            stringBuilder.append(aChar);
        }
    }




    static String toPinyinPhoneticSignUpper(String word ) throws BadHanyuPinyinOutputFormatCombination {
        StringBuilder stringBuilder = new StringBuilder();
        HanyuPinyinOutputFormat format = new HanyuPinyinOutputFormat();
        format.setToneType(HanyuPinyinToneType.WITH_TONE_MARK);
        format.setCaseType(HanyuPinyinCaseType.UPPERCASE);
        format.setVCharType(HanyuPinyinVCharType.WITH_U_UNICODE);
        char[] chars = word.toCharArray();
        buildChars(chars,stringBuilder,format);
        return stringBuilder.toString();
    }

    static String toPinyinPhoneticSignLower(String word ) throws BadHanyuPinyinOutputFormatCombination {
        StringBuilder stringBuilder = new StringBuilder();
        HanyuPinyinOutputFormat format = new HanyuPinyinOutputFormat();
        format.setCaseType(HanyuPinyinCaseType.LOWERCASE);
        format.setToneType(HanyuPinyinToneType.WITH_TONE_MARK);
        format.setVCharType(HanyuPinyinVCharType.WITH_U_UNICODE);
        char[] chars = word.toCharArray();
        buildChars(chars,stringBuilder,format);
        return stringBuilder.toString();
    }


    /**
     * 通过正则表达式进行替换
     */
    static String replacePattern(String word,String pattern){
        if (word != null) {
            Pattern p = Pattern.compile(pattern);
            Matcher m = p.matcher(word);
            word = m.replaceAll("");
        }
        return word;
    }

    static String replacePattern(String word,String replace,String pattern){
        if (word != null) {
            Pattern p = Pattern.compile(pattern);
            Matcher m = p.matcher(word);
            word = m.replaceAll(replace);
        }
        return word;
    }

}
