package util;

import com.google.common.collect.Lists;
import entity.OriginTimeValue;
import entity.TargetTimeValue;
import util.time.FillFullTimeValueUtil;

import java.time.LocalDateTime;
import java.util.List;
import java.util.TimeZone;

public class FullFillTimeValueTest {


    public static void main(String[] args) {
        List<OriginTimeValue> originTimeValueList = Lists.newArrayList();
        originTimeValueList.add(new OriginTimeValue(1542995383, 109991));

        List<TargetTimeValue> targetTimeValues1 = FillFullTimeValueUtil.MINUTE.fullFillTimeValue(LocalDateTime.now(), LocalDateTime.now()
                        .plusDays(1), 1, originTimeValueList,
                TimeZone.getDefault());


        List<TargetTimeValue> targetTimeValues2 = FillFullTimeValueUtil.HOUR.fullFillTimeValue(LocalDateTime.now(), LocalDateTime.now()
                        .plusDays(1), 2, originTimeValueList,
                TimeZone.getDefault());

        List<TargetTimeValue> targetTimeValues3 = FillFullTimeValueUtil.DAY.fullFillTimeValue(LocalDateTime.now(), LocalDateTime.now()
                        .plusDays(100), 10, originTimeValueList,
                TimeZone.getDefault());

        List<TargetTimeValue> targetTimeValues4 = FillFullTimeValueUtil.MINUTE.fullFillTimeValue(LocalDateTime.now(), LocalDateTime.now()
                        .plusDays(1), 1, null,
                TimeZone.getDefault());


        targetTimeValues1.forEach(targetTimeValue -> System.out.println(targetTimeValue.getTime() + " , " + targetTimeValue.getValue()));

        System.out.println("---------------------------------------------------------------------");

        targetTimeValues2.forEach(targetTimeValue -> System.out.println(targetTimeValue.getTime() + " , " + targetTimeValue.getValue()));

        System.out.println("---------------------------------------------------------------------");

        targetTimeValues3.forEach(targetTimeValue -> System.out.println(targetTimeValue.getTime() + " , " + targetTimeValue.getValue()));

         System.out.println("---------------------------------------------------------------------");

        targetTimeValues4.forEach(targetTimeValue -> System.out.println(targetTimeValue.getTime() + " , " + targetTimeValue.getValue()));

    }
}
