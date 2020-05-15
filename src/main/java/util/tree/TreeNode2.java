package util.tree;

import java.util.List;

/**
 * 这个对象主要用于处理从父推子的一条链路的处理
 * @author  黄志军
 */
public class TreeNode2 {

    /**
     * 当前节点的标识，code
     */
    private String code;

    /**
     * 父节点标识
     */
    private String parentCode;

    /**
     * 子节点对象数组
     */
    private List<TreeNode2> childNodeList;

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

    public List<TreeNode2> getChildNodeList() {
        return childNodeList;
    }

    public void setChildNodeList(List<TreeNode2> childNodeList) {
        this.childNodeList = childNodeList;
    }
}
