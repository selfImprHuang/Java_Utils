package util.tree;

import com.alibaba.fastjson.JSON;

public class TreeUtilTest {
    public static void main(String[] args) {
            String treeNodeString = "[{\"code\":\"aa\",\"parentCode\":\"a\"},{\"code\":\"aaa\",\"parentCode\":\"aa\"},{\"code\":\"aaaa\","
                    + "\"parentCode\":\"aaa\"},{\"code\":\"bbbb\",\"parentCode\":\"aaa\"},{\"code\":\"XXX\",\"parentCode\":\"aaaa\"},"
                    + "{\"code\":\"22121\",\"parentCode\":\"XXX\"},{\"code\":\"a\",\"parentCode\":\"0\"},{\"code\":\"222\",\"parentCode\":\"a\"},"
                    + "{\"code\":\"AXMW\",\"parentCode\":\"222\"}]";
            System.out.println(TreeUtils.getCodePath(JSON.parseArray(treeNodeString, TreeNode.class),"aa"));
            System.out.println(TreeUtils.getCodePath(JSON.parseArray(treeNodeString, TreeNode.class),"mmmm"));

            TreeNode2 t2 = TreeUtils.getTreeWithChildNodeList(JSON.parseArray(treeNodeString, TreeNode2.class),"a");
            TreeNode2 t3 = TreeUtils.getTreeWithChildNodeList(JSON.parseArray(treeNodeString, TreeNode2.class),"mmmm");
            TreeNode2 t4 = TreeUtils.getTreeWithChildNodeList(JSON.parseArray(treeNodeString, TreeNode2.class),"AXMW");
            System.out.println("");
    }
}
