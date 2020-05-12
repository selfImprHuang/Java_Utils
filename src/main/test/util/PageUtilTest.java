package util;


import entity.CommonPageResp;

import java.util.ArrayList;
import java.util.List;


public class PageUtilTest {


    private static List<String> valueList = new ArrayList<>();
    private static List<String> emptyList = new ArrayList<>();
    private static List<String> nullList =null;

    public static void dataMake(){
        valueList.add("1");
        valueList.add("2");
        valueList.add("3");
        valueList.add("4");
        valueList.add("5");
        valueList.add("6");
        valueList.add("7");
        valueList.add("8");
        valueList.add("9");
        valueList.add("10");
    }

    public static void main(String[] args) {
        dataMake();

//        CommonPageResp<String> result = PageUtil.pagingListFromZero(valueList,-1,100);
        CommonPageResp<String> result1 = PageUtil.pagingListFromZero(valueList,1,2);
        CommonPageResp<String> result2 =  PageUtil.pagingListFromZero(valueList,0,2);
        CommonPageResp<String> result3 =  PageUtil.pagingListFromZero(valueList,100,2);
        CommonPageResp<String> result5 =  PageUtil.pagingListFromZero(emptyList,100,3);
        CommonPageResp<String> result6 =  PageUtil.pagingListFromZero(nullList,100,2);


//        CommonPageResp<String> result = PageUtil.pagingListFromOne(valueList,-1,100);
        CommonPageResp<String> result7 = PageUtil.pagingListFromOne(valueList,1,2);
        CommonPageResp<String> result8 = PageUtil.pagingListFromOne(valueList,2,2);
        CommonPageResp<String> result9 =  PageUtil.pagingListFromOne(valueList,100,2);
        CommonPageResp<String> result10 =  PageUtil.pagingListFromOne(emptyList,100,3);
        CommonPageResp<String> result11 =  PageUtil.pagingListFromOne(nullList,100,2);
        System.out.println("直接断点查看结果");
    }
}