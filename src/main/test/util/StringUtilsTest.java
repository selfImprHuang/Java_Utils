package util;

import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

public class StringUtilsTest {


    public static void main(String[] args) throws BadHanyuPinyinOutputFormatCombination {
      System.out.println(  StringUtils.upperFirstLetter("abx123"));
      System.out.println(  StringUtils.upperFirstLetter("123abx123"));
      System.out.println(  StringUtils.upperFirstLetter("%%#@abx123"));


      System.out.println(  StringUtils.lowerFirstLetter("Abx123"));
      System.out.println(  StringUtils.lowerFirstLetter("123abx123"));
      System.out.println(  StringUtils.lowerFirstLetter("%%#@abx123"));

      System.out.println(  StringUtils.upperAllLetter("Abx123"));
      System.out.println(  StringUtils.upperAllLetter("123abx123"));
      System.out.println(  StringUtils.upperAllLetter("%%#@abx123"));


      System.out.println(  StringUtils.lowerAllLetter("Abx123"));
      System.out.println(  StringUtils.lowerAllLetter("123abx123"));
      System.out.println(  StringUtils.lowerAllLetter("%%#@abx123"));


      System.out.println(  StringUtils.appendAll("%%#@abx123","dsadasdsad"));
      System.out.println(  StringUtils.appendAll("%%#@abx123"));
      System.out.println(  StringUtils.appendAll());
      System.out.println(  StringUtils.appendAll("%%#@abx123","dasde2weqwewq","d dasdsa dasdas da dsa"));


      System.out.println(  StringUtils.isContainChinese("%%#@abx123"));
      System.out.println(  StringUtils.isContainChinese("%%#@哈哈哈哈的撒娇低价十九大uiyhuids"));
      System.out.println(  StringUtils.isContainChinese(""));
      System.out.println(  StringUtils.isContainChinese("大数99092jkjj大声道"));
      System.out.println(  StringUtils.isContainChinese("大数99092jkjj"));

      System.out.println(  StringUtils.isChineseChar('1'));
      System.out.println(  StringUtils.isChineseChar('我'));

      System.out.println(  StringUtils.toPinyinUpper("我爱中国"));
      System.out.println(  StringUtils.toPinyinUpper("%%#@我爱中国"));
      System.out.println(  StringUtils.toPinyinUpper(""));
      System.out.println(  StringUtils.toPinyinUpper("我爱中国12321dsad"));
      System.out.println(  StringUtils.toPinyinUpper("12321dsad"));


      System.out.println(  StringUtils.toPinyinLower("我爱中国"));
      System.out.println(  StringUtils.toPinyinLower("%%#@我爱中国"));
      System.out.println(  StringUtils.toPinyinLower(""));
      System.out.println(  StringUtils.toPinyinLower("我爱中国12321dsad"));
      System.out.println(  StringUtils.toPinyinLower("12321dsad"));



      System.out.println(  StringUtils.toPinyinPhoneticSignUpper("我爱中国"));
      System.out.println(  StringUtils.toPinyinPhoneticSignUpper("%%#@我爱中国"));
      System.out.println(  StringUtils.toPinyinPhoneticSignUpper(""));
      System.out.println(  StringUtils.toPinyinPhoneticSignUpper("我爱中国12321dsad"));
      System.out.println(  StringUtils.toPinyinPhoneticSignUpper("12321dsad"));



      System.out.println(  StringUtils.toPinyinPhoneticSignLower("我爱中国"));
      System.out.println(  StringUtils.toPinyinPhoneticSignLower("%%#@我爱中国"));
      System.out.println(  StringUtils.toPinyinPhoneticSignLower(""));
      System.out.println(  StringUtils.toPinyinPhoneticSignLower("我爱中国12321dsad"));
      System.out.println(  StringUtils.toPinyinPhoneticSignLower("12321dsad"));

      System.out.println(StringUtils.replacePattern("ABCDEFG","[A-C]"));
      System.out.println(StringUtils.replacePattern("ABCDEFG12333","[A-C1-3]"));
      System.out.println(StringUtils.replacePattern("X432432^&*(DSAD","[A-C1-2]"));

      System.out.println(StringUtils.replacePattern("ABCDEFG","XYZ","[A-C]"));
      System.out.println(StringUtils.replacePattern("ABCDEFG12333","YYYM","[A-C1-3]"));
      System.out.println(StringUtils.replacePattern("X432432^&*(DSAD","中文，213321sdadsa","[A-C1-2]"));
    }


}
