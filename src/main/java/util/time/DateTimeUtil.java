
package util.time;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.TimeZone;

import static additive.ValidTool.assertIsTrue;

public class DateTimeUtil {

    private static final String DEFAULT_DATE_PATTERN = "yyyy-MM-dd";
    private static final String DEFAULT_TIME_PATTERN = "HH:mm:ss";
    private static final String DEFAULT_PATTERN = "yyyy-MM-dd HH:mm:ss";
    private static final String DEFAULT_PATTERN_CLOSE = "yyyyMMddHHmmss";
    private static final String DATE_TIME_MINUTE_PATTERN = "yyyy-MM-dd HH:mm";
    private static final String ISO_8601_PATTERN = "yyyy-MM-dd'T'HH:mm:ss.SSSZZ";
    private static final String lO_G_PARAM_TIME_PATTERN = "yyyy-MM-dd-HHmm";


    /**
     * 获取当天日期,"yyyy-MM-dd"
     */
    public static String getCurrentDate() {
        return LocalDate.now().toString();
    }

    /**
     * 获取当前时间,yyyy-MM-dd HH:mm:ss
     */
    public static String getCurrentDateTime() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(DEFAULT_PATTERN));
    }


    /**
     * 获取与所给日期间隔要求天数的日期
     * @param localDate 参考日期, yyyy-MM-dd
     * @param dayOffset 间隔天数
     */
    public static String plusDay(final String localDate, final int dayOffset) {
        assertIsTrue(dayOffset >= 0, "偏移量必须大于0");
        return LocalDate.parse(localDate).plusDays(dayOffset).format(DateTimeFormatter.ISO_LOCAL_DATE);
    }

    /**
     * 获取与所给日期间隔要求天数的日期
     * @param localDate 参考日期, yyyy-MM-dd
     * @param dayOffset 间隔天数
     */
    public static String minusDay(final String localDate, final int dayOffset) {
        assertIsTrue(dayOffset >= 0, "偏移量必须大于0");
        return LocalDate.parse(localDate).minusDays(dayOffset).format(DateTimeFormatter.ISO_LOCAL_DATE);
    }


    /**
     * 将日期时间转换成指定格式的时间
     */
    public static String dateToString(String pattern, LocalDateTime dateTime) {
        return DateTimeFormatter.ofPattern(pattern).format(dateTime);
    }

    /**
     * 时间戳转换为指定格式字符串（秒）
     */
    public static String dateToString(String pattern, long epochSecond, TimeZone timeZone) {
        return dateToString(pattern, LocalDateTime.ofInstant(Instant.ofEpochSecond(epochSecond), timeZone.toZoneId()));
    }


    /**
     * 时间戳转成指定格式字符串（毫秒）
     */
    public static String timestampToString(String pattern, long timestamp, TimeZone timeZone) {
        return dateToString(pattern, LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), timeZone.toZoneId()));
    }

    public static String dateToString(String pattern, ZonedDateTime dateTime) {
        return DateTimeFormatter.ofPattern(pattern)
            .format(dateTime);
    }

    /**
     * 将LocalDateTime转换成指定格式字符串
     */
    public static String localTimeToString(LocalDateTime localDateTime, String pattern) {
        LocalTime localTime = localDateTime.toLocalTime();
        return DateTimeFormatter.ofPattern(pattern).format(localTime);
    }

    /**
     * 将时间格式换成"HH:mm:ss" 格式
     */
    public static String formatDateToTime(LocalDateTime date) {
        return DateTimeUtil.dateToString(DEFAULT_TIME_PATTERN, date);
    }

    /**
     * 将时间格式换成"yyyy-MM-dd" 格式
     */
    public static String formatDateToDay(LocalDateTime date) {
        return DateTimeUtil.dateToString(DEFAULT_DATE_PATTERN, date);
    }

    /**
     * @param timeString yyyy-MM-dd-HHmm
     * @return yyyy-MM-dd HH:mm 格式的时间字符串
     */
    public static String paramTimeFormat(String timeString) throws ParseException {
        Date newDate = new SimpleDateFormat(lO_G_PARAM_TIME_PATTERN).parse(timeString);
        return new SimpleDateFormat(DATE_TIME_MINUTE_PATTERN).format(newDate);
    }


    /**
     * 获取当前时间,yyyy-MM-dd HH:mm:ss
     * 注意：使用当前系统默认的时区
     */
    public static LocalDateTime getNow() {
        return LocalDateTime.now();
    }

    /**
     * 将时间戳（单位：毫秒）转成 LocalDateTime
     */
    public static LocalDateTime timeStampToLocalDateTime(long timeStamp) {
        return Instant.ofEpochMilli(timeStamp).atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    /**
     * 将时间戳（单位为：秒）转成 LocalDateTime
     */
    public static LocalDateTime epochSecondToLocalDateTime(long epochSecond, TimeZone timeZone) {
        return epochSecondToLocalDateTime(epochSecond, timeZone.toZoneId());
    }


    /**
     * 将时间戳（单位为：秒）转成 LocalDateTime
     */
    public static LocalDateTime epochSecondToLocalDateTime(long epochSecond, ZoneId zoneId) {
        return Instant.ofEpochSecond(epochSecond).atZone(zoneId).toLocalDateTime();
    }

    /**
     * LocalDateTime转成时间戳：毫秒
     */
    public static long toEpochMilli(LocalDateTime localDateTime, TimeZone timeZone) {
        return Instant.from(localDateTime.atZone(timeZone.toZoneId())).toEpochMilli();
    }

    /**
     * 将字符串转换为LocalDateTime
     */
    public static LocalDateTime stringToLocalDateTime(String dateStr, String pattern) {
        DateTimeFormatter df = DateTimeFormatter.ofPattern(pattern);
        return LocalDateTime.parse(dateStr, df);
    }


    /**
     * 到天的字符串,转成LocalDateTime
     * @param dayStr 如"2017-11-16"
     * @return 返回0点0分0秒的时间 如 "2017-11-16 00:00:00"
     */
    public static LocalDateTime dayStringToLocalDateTime(String dayStr) {
        return LocalDate.parse(dayStr, DateTimeFormatter.ofPattern(DEFAULT_DATE_PATTERN)).atTime(0, 0, 0);
    }

    /**
     * LocalDateTime转成时间戳：秒
     */
    public static long toEpochSecond(LocalDateTime localDateTime, TimeZone timeZone) {
        return Instant.from(localDateTime.atZone(timeZone.toZoneId())).getEpochSecond();
    }


    public static long toEpochSecond(LocalDateTime localDateTime, ZoneId zoneId) {
        return localDateTime.atZone(zoneId).toEpochSecond();
    }


    /**
     * 获取当前时间的秒数
     */
    public static long getNowSeconds(){
  return
      LocalDateTime.now().toEpochSecond(ZoneOffset.MAX);
    }

    /**
     * 是否同一个时间点
     */
    public static boolean isTheSameDay(LocalDateTime startDate, LocalDateTime endDate) {
        return startDate.toLocalDate()
            .isEqual(endDate.toLocalDate());
    }

    /**
     * LocalDateTime 转成时间戳
     */
    public static Instant toInstant(LocalDateTime endDate, TimeZone timeZone) {
        return endDate.atZone(timeZone.toZoneId()).toInstant();
    }
}
