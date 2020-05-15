/*
 * @(#) TreeUtils
 * 版权声明 网宿科技, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:网宿科技
 * <br> @author Administrator
 * <br> @description 功能描述
 * <br> 2019-01-02 22:24:06
 */

package util.tree;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 树数据的操作工具
 * 参考SI，兰姐，导入业务（参考ws的业务）
 * @author 黄志军
 */
class TreeUtils {

    private static final String SEMICOLON = ";";

    /**
     * 获取path的值(从根节点到当前节点的路径值),这边这个方法会对对应的code进行path的生成（前提是根节点的parentCode是空，或者用其他的标识也可以）
     *
     * @param treeNodeList 所有的树节点，因为这个主要是导入业务，所以数据包含文件和数据库中的
     * @param code 节点code
     * @return 从根节点到当前节点的路径值
     */
    static String getCodePath(List<TreeNode> treeNodeList, String code) {
        //对所有的节点进行校验，校验规则是不能存在两个code一样的节点
        validTreeNodeList(treeNodeList);
        Map<String, TreeNode> treeNodeMap = Maps.newHashMap();
        //创建 code-节点的键值对关系
        treeNodeList.forEach(treeNode -> treeNodeMap.put(treeNode.getCode(), treeNode));
        //通过 递归函数 获取父节点以上的path关系
        StringBuffer pathStringBuffer = findParentCodes(treeNodeMap, code);
        //把父节点code和节点code拼接进去,如果这边本身就不存在这个code，就直接返回空，而不把这个code进行append
       if(treeNodeMap.get(code)!=null){
           pathStringBuffer.append(SEMICOLON).append(code).append(SEMICOLON);
       }
        return pathStringBuffer.toString();
    }

    /**
     *
     *
     * @param treeNodeMap code-节点信息的map
     * @param code 节点信息(这个code是作为递归的起点)
     * @return 该节点父节点以上的path字符串
     */
    private static StringBuffer findParentCodes(Map<String, TreeNode> treeNodeMap, String code) {
        StringBuffer result = new StringBuffer();
        TreeNode treeNode = treeNodeMap.get(code);
        //如果当前节点不为空。往下查找他的父节点
        if (treeNode != null) {
            TreeNode parentTreeNode = treeNodeMap.get(treeNode.getParentCode());
            //如果父节点不为空
            if (parentTreeNode != null) {
                //把父节点的code插入到最前面。
                result.insert(0, SEMICOLON + parentTreeNode.getCode());
                //通过递归，把父节点上面的节点找出来
                result.insert(0, findParentCodes(treeNodeMap, parentTreeNode.getCode()));
            } else {
                return result;
            }
        }
        //直到当前节点为空，返回拼接的字符串
        return result;
    }


    static TreeNode2 getTreeWithChildNodeList(List<TreeNode2> treeNodeList ,String code){
        TreeNode2 destNode = validTreeNode2List(treeNodeList,code);
        if (destNode == null ){
            return null;
        }
        Map<String, List<TreeNode2>> treeNodeMap = Maps.newHashMap();
        //创建 父code-节点的键值对关系
        treeNodeList.forEach(treeNode -> {
            List<TreeNode2> list = treeNodeMap.get(treeNode.getParentCode());
            if (list == null ){
                list = Lists.newArrayList();
            }
            list.add(treeNode);
            treeNodeMap.put(treeNode.getParentCode(),list);
        });
        //通过 递归函数 获取父节点以上的path关系
        destNode.setChildNodeList(getChildNodeList(treeNodeMap,code));
        return destNode;
    }

    private static List<TreeNode2> getChildNodeList( Map<String, List<TreeNode2>> treeNodeMap, String code) {
       List<TreeNode2> list = treeNodeMap.get(code);
       if( list == null || CollectionUtils.isEmpty(list)){
            return null;
        }
        for(TreeNode2 treeNode2:list){
            treeNode2.setChildNodeList(getChildNodeList(treeNodeMap,treeNode2.getCode()));
        }

        return list;
    }


    private static void validTreeNodeList(List<TreeNode> treeNodeList){
        List<String> codeList  = treeNodeList.stream().map(TreeNode::getCode).distinct().collect(Collectors.toList());
        if(codeList.size() != treeNodeList.size()){
            throw new RuntimeException("存在相同的code");
        }
    }

    private static TreeNode2 validTreeNode2List(List<TreeNode2> treeNodeList,String code){
        List<String> codeList  = treeNodeList.stream().map(TreeNode2::getCode).distinct().collect(Collectors.toList());
        if(codeList.size() != treeNodeList.size()){
            throw new RuntimeException("存在相同的code");
        }
        List<TreeNode2> list = treeNodeList.stream().filter(item->item.getCode().equals(code)).collect(Collectors.toList());
        return CollectionUtils.isEmpty(list) ?null:list.get(0);
    }
}
