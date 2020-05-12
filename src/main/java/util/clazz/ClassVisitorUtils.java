/*
 * @(#) ClassVisitorUtils
 * 版权声明 网宿科技, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2018
 * <br> Company:网宿科技
 * <br> @author Administrator
 * <br> @description 功能描述
 * <br> 2018-10-07 22:38:38
 */

package util.clazz;

import jdk.internal.org.objectweb.asm.ClassVisitor;
import jdk.internal.org.objectweb.asm.MethodVisitor;
import jdk.internal.org.objectweb.asm.Opcodes;
import jdk.internal.org.objectweb.asm.Type;

import java.lang.reflect.Method;
import java.util.Arrays;

public class ClassVisitorUtils extends ClassVisitor {

    /**需要获取到参数名称的方法*/
    private Method method;

    /***/
    private Type[] types;

    /**存放参数名称的数组*/
    private String[] parameterNames;

    public ClassVisitorUtils(int i) {
        super(i);
    }

    public ClassVisitorUtils(int i, ClassVisitor classVisitor) {
        super(i, classVisitor);
    }

    public ClassVisitorUtils(int i, Method method, Type[] types, String[] parameterNames) {
        super(i);
        this.method = method;
        this.types = types;
        this.parameterNames = parameterNames;
    }

    /**我们重写这个方法在我们的ClassUtils里面去使用*/
    @Override
    public MethodVisitor visitMethod(int access, String name, String desc, String signature, String[] exceptions) {
        Type[] argumentTypes = Type.getArgumentTypes(desc);
        if (!method.getName().equals(name) || !Arrays.equals(argumentTypes, types)) {
            return null;
        }

        /**这个地方注意每次调用结束的重置*/
        MethodVisitorUtils methodVisitorUtils = new MethodVisitorUtils(Opcodes.ASM4, argumentTypes, method, parameterNames);
        methodVisitorUtils.resetParamLocation();
        return methodVisitorUtils;
    }
}
