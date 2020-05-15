/*
 * @(#) TreeNode
 * 版权声明 网宿科技, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:网宿科技
 * <br> @author Administrator
 * <br> @description 功能描述
 * <br> 2019-01-02 22:24:56
 */

package util.tree;

/**
 * 树节点，主要是包含了path和parentCode的通用属性
 * @author 黄志军
 */
public class TreeNode {

    /**
     * 当前节点的标识，code
     */
    private String code;

    /**
     * 父节点标识
     */
    private String parentCode;

    /**
     * 包含所有节点的code，包括自己
     * 比如说该节点为1，父节点为2，爷爷节点为3，网上根节点保存的是4.
     * path保存的就是4;3;2;1;
     */
    private String path;


    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getParentCode() {
        return parentCode;
    }

    public void setParentCode(String parentCode) {
        this.parentCode = parentCode;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
