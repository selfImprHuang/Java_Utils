/*
 * @(#) PagingQueryResp
 * 版权声明 网宿科技, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2018
 * <br> Company:网宿科技
 * <br> @author Administrator
 * <br> @description 功能描述
 * <br> 2018-11-24 19:57:07
 */

package entity;


import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * 分页返回数据
 *
 * @author yexr
 */
public class CommonPageResp<T> {
    /**
     * 页数
     */
    @Min(0)
    @NotNull
    private Integer pageIndex;
    /**
     * 页面大小
     */
    @NotNull
    @Min(1)
    private Integer pageSize;


    public Integer getPageIndex() {
        return pageIndex;
    }

    public void setPageIndex(Integer pageIndex) {
        this.pageIndex = pageIndex;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    private Integer total;

    private List<T> resultList;

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public List<T> getResultList() {
        return resultList;
    }

    public void setResultList(List<T> resultList) {
        this.resultList = resultList;
    }
}
