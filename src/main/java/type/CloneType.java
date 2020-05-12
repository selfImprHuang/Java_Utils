/*
 * @(#) CloneType
 * 版权声明 网宿科技, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2018
 * <br> Company:网宿科技
 * <br> @author Administrator
 * <br> @description 功能描述
 * <br> 2018-10-07 17:13:13
 */

package type;

/**
 * @author selfImpr
 */
public enum CloneType {

    /**
     * 基本类型和final的不需要复制的类型
     */
    SIMPLE_TYPE,

    /**
     * 数组
     */
    ARRAY,

    /**
     * 需要深度克隆的类
     */
    DEEP_CLONE_CLASS
}
