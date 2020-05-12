

package util.time;

import com.google.common.collect.Lists;
import entity.OriginTimeValue;
import entity.TargetTimeValue;
import org.springframework.util.CollectionUtils;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 补时间点工具类
 * 之前在ws上班的时候，处理图标数据会遇到某些点没有数据的情况，就需要对这些时间点进行补点处理
 *
 * @author huangzj
 * @date 2018-11-23 22:43:36
 */
public enum FillFullTimeValueUtil {
    /**
     * 分钟粒度
     */
    MINUTE {
        @Override
        public List<TargetTimeValue> fullFillTimeValue(LocalDateTime startDate, LocalDateTime endDate, int timeInterval,
                                                       List<OriginTimeValue> originTimeValues, TimeZone timeZone) {
            //Myview 向前聚合，返回前XX秒为最开始计数时间
            Instant firstInstant = toInstant(startDate, timeZone);
            Instant finalInstant = toInstant(endDate, timeZone);
            //补时间点--规则一样,间隔转换成秒
            return fullFillRule(originTimeValues, firstInstant, finalInstant, timeInterval * 60);
        }
    },
    /**
     * 小时粒度
     */
    HOUR {
        @Override
        public List<TargetTimeValue> fullFillTimeValue(LocalDateTime startDate, LocalDateTime endDate, int timeInterval,
                                                       List<OriginTimeValue> originTimeValues, TimeZone timeZone) {
            Instant firstInstant = toInstant(startDate, timeZone);
            Instant finalInstant = toInstant(endDate, timeZone);
            //补时间点--规则一样
            return fullFillRule(originTimeValues, firstInstant, finalInstant, timeInterval * 60 * 60);
        }
    },
    /**
     * 天粒度
     */
    DAY {
        @Override
        public List<TargetTimeValue> fullFillTimeValue(LocalDateTime startDate, LocalDateTime endDate, int timeInterval,
                                                       List<OriginTimeValue> originTimeValues, TimeZone timeZone) {
            //区别，把时间转成天
            Instant firstInstant = toInstant(LocalDateTime.of(startDate.toLocalDate(), LocalTime.of(0, 0, 0)), timeZone);
            Instant finalInstant = toInstant(LocalDateTime.of(endDate.toLocalDate(), LocalTime.of(0, 0, 0)), timeZone);
            //补时间点--规则一样
            return fullFillRule(originTimeValues, firstInstant, finalInstant, timeInterval * 60 * 60 * 24);
        }
    };


    /**
     *  抽象方法，实现补充时间点
     * @param startDate 开始时间 格式如：yyyy-MM-dd 00:00:00
     * @param endDate 结束时间：格式如：yyyy-MM-dd 23:59:59
     * @param timeInterval 数据采集粒度，单位：分钟、小时、天
     * @param originTimeValues 缺少时间点对象（统一处理成long、long）
     * @param timeZone 时区
     * @return 补时间点后对象，没有补null
     */
    public abstract List<TargetTimeValue> fullFillTimeValue(LocalDateTime startDate, LocalDateTime endDate,
                                                            int timeInterval, List<OriginTimeValue> originTimeValues, TimeZone timeZone);


    /**
     *
     * @param dateTime 时间
     * @param timeZone 时区
     * @return Instant，和TimeStamp类似
     */
    private static Instant toInstant(LocalDateTime dateTime, TimeZone timeZone) {
        return dateTime.atZone(timeZone.toZoneId())
            .toInstant();
    }


    private static List<TargetTimeValue> fullFillRule(List<OriginTimeValue> originTimeValues, Instant firstInstant, Instant finalInstant,
                                                      int seconds) {
        //转换为Time-value形式的map
        if (CollectionUtils.isEmpty(originTimeValues)) {
            originTimeValues = Lists.newArrayList();
        }
        Map<Long, Long> timeValueMap = originTimeValues.stream().collect(Collectors.toMap(OriginTimeValue::getTime,
            OriginTimeValue::getValue));
        final List<TargetTimeValue> resultList = new ArrayList<>();

        Instant cursorInstant = firstInstant;
        //循环按照时间粒度补充时间点。
        while (cursorInstant.isBefore(finalInstant) || cursorInstant.equals(finalInstant)) {
            long epochSecond = cursorInstant.getEpochSecond();
            TargetTimeValue timeValueInRule = new TargetTimeValue();
            timeValueInRule.setValue(timeValueMap.getOrDefault(epochSecond, null));
            timeValueInRule.setTime(epochSecond);
            resultList.add(timeValueInRule);

            //移动到下一个数据点
            cursorInstant = cursorInstant.plusSeconds(seconds);
        }
        //按时间排序，最新的排在最后面
        return resultList.parallelStream()
            .sorted(Comparator.comparing(TargetTimeValue::getTime))
            .collect(Collectors.toList());
    }
}
