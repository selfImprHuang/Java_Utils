/*
 * @(#) PageUtil
 * 版权声明 网宿科技, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2018
 * <br> Company:网宿科技
 * <br> @author Administrator
 * <br> @description 功能描述
 * <br> 2018-11-24 19:55:37
 */

package util;


import entity.CommonPageResp;

import java.util.Collections;
import java.util.List;

import static additive.ValidTool.assertIsTrue;
import static java.lang.Math.min;


/**
 * 分页工具类
 *
 * @author 志军
 * @date
 */
public class PageUtil {

    private static final int ZERO = 0;

    /**
     * 前端传，从0开始分页（对list进行分页）
     * @param list 列表
     * @param pageIndex 页码
     * @param pageSize 页数
     * @param <T> T
     * @return 分页通用对象
     */
    public static <T> CommonPageResp<T> pagingListFromZero(List<T> list, int pageIndex, int pageSize) {
        assertIsTrue(pageIndex >= 0, "pageIndex必需大于等于0");

        if (list == null ) {
            return nullPage(pageSize);
        }
        CommonPageResp<T> pagingQueryResp = new CommonPageResp<>();
        int index = min(((list.size() - 1) / pageSize), pageIndex);
        pagingQueryResp.setPageIndex(index);
        pagingQueryResp.setPageSize(pageSize);
        pagingQueryResp.setTotal(list.size());
        pagingQueryResp.setResultList(list.subList(index * pageSize, min((index + 1) * pageSize, list.size())));
        return pagingQueryResp;
    }



    /**
     * 前端传，从1开始分页（对list进行分页）
     * @param list 列表
     * @param pageIndex 页码
     * @param pageSize 页数
     * @param <T> T
     * @return 分页通用对象
     */
    static <T> CommonPageResp<T> pagingListFromOne(List<T> list, int pageIndex, int pageSize) {
        if ( pageIndex<1){
            pageIndex = 1;
        }
        CommonPageResp<T> pagingQueryResp = new CommonPageResp<>();

        if (list == null) {
            return nullPage(pageSize);
        }
        int index = min(((list.size() - 1 )/ pageSize + 1), pageIndex);
        pagingQueryResp.setPageIndex(index);
        pagingQueryResp.setPageSize(pageSize);
        pagingQueryResp.setTotal(list.size());
        pagingQueryResp.setResultList(list.subList((index - 1) * pageSize, min(index * pageSize, list.size())));
        return pagingQueryResp;
    }

    private static <T> CommonPageResp<T> nullPage(int pageSize) {
        CommonPageResp<T> pagingQueryResp = new CommonPageResp<>();
        pagingQueryResp.setResultList(Collections.emptyList());
        pagingQueryResp.setTotal(ZERO);
        pagingQueryResp.setPageIndex(ZERO);
        pagingQueryResp.setPageSize(pageSize);
        return pagingQueryResp;
    }

}
