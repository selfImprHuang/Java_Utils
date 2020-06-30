/*
 * @(#) MethodVisitorUtils
 * 版权声明 网宿科技, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2018
 * <br> Company:网宿科技
 * <br> @author Administrator
 * <br> @description 功能描述
 * <br> 2018-10-07 22:55:01
 */

package util.clazz;

import jdk.internal.org.objectweb.asm.Label;
import jdk.internal.org.objectweb.asm.MethodVisitor;
import jdk.internal.org.objectweb.asm.Type;

import java.lang.reflect.Method;

public class MethodVisitorUtils extends MethodVisitor {

    /**方法的参数的位置，因为asm返回的参数有一些没看懂，所以这边使用这个方式来标记位置*/
    private int paramLocation = 0;

    private Type[] argumentTypes;

    /**需要获取到参数名称的方法*/
    private Method method;

    /**存放参数名称的数组*/
    private String[] parameterNames;

    public MethodVisitorUtils(int i) {
        super(i);
    }

    public MethodVisitorUtils(int i, MethodVisitor methodVisitor) {
        super(i, methodVisitor);
    }

    public MethodVisitorUtils(int i, Type[] argumentTypes, Method method, String[] parameterNames) {
        super(i);
        this.parameterNames = parameterNames;
        this.method = method;
        this.argumentTypes = argumentTypes;
    }

    /**这个方法好像不需要...其实他每次都是new一下这个玩意。*/
    public void resetParamLocation() {
        this.paramLocation = 0;
    }

    @Override
    public void visitLocalVariable(String name, String desc, String signature, Label start, Label end, int index) {

        //这里还要注意的就是他比较完 ，全部以后还会去比较
        if (paramLocation > argumentTypes.length - 1) {
            return;
        }

        //他这里会返回一些奇怪的参数，具体我也不知道为什么，所以这边以我们拿到匹配的参数开始计算
        if (argumentTypes[paramLocation].toString().equals(desc)) {
            // 静态方法第一个参数就是方法的参数，如果是实例方法，第一个参数是this
            // if (Modifier.isStatic(method.getModifiers())) {
                parameterNames[paramLocation] = name;
                System.out.println(name);
            // } else if (index > 0) {
            //     parameterNames[paramLocation + 1] = name;
            //     System.out.println(name);
            // }
            paramLocation++;
        }
    }
}
