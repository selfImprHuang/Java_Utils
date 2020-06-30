package util.clazz;


import exception.BeanCloneException;
import jdk.internal.org.objectweb.asm.ClassReader;
import jdk.internal.org.objectweb.asm.Opcodes;
import jdk.internal.org.objectweb.asm.Type;
import type.CloneType;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.ParameterizedType;
import java.util.*;


/**
 * 类操作的工具类
 *
 * @author selfImpr
 */
public class ClassUtils {

    /**
     * final基本类型对象
     */
    private static List<Class> basicWrapType;


    static {
        basicWrapType = Arrays.asList(new Class[]{Byte.class, Short.class, Integer.class, Long.class, Float.class, Double.class, Boolean
                .class, Character.class, String.class});
    }

    public static CloneType getCloneType(Object object) {
        //判断是不是基本类型
        if (object.getClass().isPrimitive()) {
            return CloneType.SIMPLE_TYPE;
        }

        if (basicWrapType.contains(object.getClass())) {
            return CloneType.SIMPLE_TYPE;
        }

        if (object.getClass().isArray()) {
            return CloneType.ARRAY;
        }

        return CloneType.DEEP_CLONE_CLASS;
    }

    public static List<Field> getAllField(Object object) {
        List<Field> fields = new ArrayList<>();
        if (object == null) {
            return fields;
        }

        //TODO 这边的这个类型会不会有问题
        return Arrays.asList(object.getClass().getDeclaredFields());
    }

    public static List<String> getAllFieldName(Object object) {
        List<String> attributes = new ArrayList<>();
        Field[] fields = object.getClass().getDeclaredFields();
        for (int i = 0; i < fields.length; i++) {
            attributes.add(fields[i].getName());
        }
        return attributes;
    }


    /**
     * 获取类层面上的泛型类型
     * 但是这边应该是有一个限制条件：因为java是泛型擦出，所以是拿不到具体的类型的....
     * 这边做一个变通就是说去拿里面数据的类型，如果没有数据的话，就统一返回Object
     * <p>
     * <p>
     * 并且还不能判断自定义的泛型类型。
     *
     * @param object
     */
    public static List<Class> getGenericParamType(Object object) {
        List<Class> genericParamType = new ArrayList<>();


        java.lang.reflect.Type type = object.getClass().getGenericSuperclass();
        if (type instanceof ParameterizedType) {
            if (Collection.class.isAssignableFrom(object.getClass())) {
                if (((Collection) object).size() == 0) {
                    genericParamType.add(Object.class);
                    return genericParamType;
                }

                genericParamType.add(((Collection) object).iterator().next().getClass());
            }

            if (Map.class.isAssignableFrom(object.getClass())) {
                if (((Map) object).size() == 0) {
                    genericParamType.add(Object.class);
                    genericParamType.add(Object.class);
                    return genericParamType;
                }

                //设置key和value的值
                genericParamType.add(((Map) object).keySet().iterator().next().getClass());
                genericParamType.add(((Map) object).values().iterator().next().getClass());

            }

        } else {
            //TODO 怎么判断自定义的类型是不是存在泛型？
        }

        return genericParamType;
    }


    /**
     * 通过Field去获取泛型的类型
     */
    public static List<Class> getGenericParamTypeInField(Field field) {
        List<Class> genericParamType = new ArrayList<>();
        if (field.getGenericType() instanceof ParameterizedType) {
            java.lang.reflect.Type[] types = ((ParameterizedType) field.getGenericType()).getActualTypeArguments();
            for (java.lang.reflect.Type type : types) {
                genericParamType.add(type.getClass());
            }

            return genericParamType;
        }

        //TODO 这边还是没有解决自定义拥有泛型类型参数的问题啊...

        genericParamType.add(field.getType());

        return genericParamType;
    }


    /**
     * 如果有一个的某个参数为空是处理不了泛型的....
     *
     */
    public static boolean isParamterTypeSame(Object originBean, Object newObject) {
         //第一个条件就是：两个类型都相同
        if (ClassUtils.getCloneType(originBean) == ClassUtils.getCloneType(newObject)) {
            switch (ClassUtils.getCloneType(originBean)) {
                case SIMPLE_TYPE:
                    return isSimpleTypeSame(originBean, newObject);
                case ARRAY:
                    return isArrayTypeSame(originBean, newObject);
                case DEEP_CLONE_CLASS:
                    return isClassTypeSame(originBean, newObject);
                default:
                    throw new BeanCloneException("判断参数类型的时候出错了");
            }
        }
        return false;
    }

    private static boolean isSimpleTypeSame(Object originBean, Object newObject) {
        if (originBean.getClass() == Class.class || newObject.getClass() == Class.class) {
            return originBean == newObject;
        }
        return originBean.getClass() == newObject.getClass();
    }

    private static boolean isArrayTypeSame(Object originBean, Object newObject) {
        if (originBean.getClass() == Class.class || newObject.getClass() == Class.class) {
            return originBean == newObject;
        }
        return originBean.getClass() == newObject.getClass();
    }


    /**
     * 不处理泛型的问题了，这个太复杂了
     * 这个方法有严重bug...
     *
     */
    private static boolean isClassTypeSame(Object originBean, Object newObject) {
        //这边是为了判断如果传进来的是集合的泛型或者是参数中的域的类型
        if (ClassUtils.getCloneType(originBean) == ClassUtils.getCloneType(newObject)) {

            if (originBean.getClass() == Class.class || newObject.getClass() == Class.class) {
                return originBean == newObject;
            }

            if (ClassUtils.getCloneType(originBean) == CloneType.SIMPLE_TYPE) {
                return isSimpleTypeSame(originBean, newObject);
            }

            if (ClassUtils.getCloneType(originBean) == CloneType.ARRAY) {
                return isArrayTypeSame(originBean, newObject);
            }

            if (Collection.class.isAssignableFrom(originBean.getClass())) {
                return isClassTypeSame(ClassUtils.getGenericParamType(originBean).get(0), ClassUtils.getGenericParamType(newObject).get(0));
            }

            if (Map.class.isAssignableFrom(originBean.getClass())) {
                return isClassTypeSame(ClassUtils.getGenericParamType(originBean).get(0), ClassUtils.getGenericParamType(newObject).get
                        (0)) && isClassTypeSame(ClassUtils.getGenericParamType(originBean).get(1), ClassUtils.getGenericParamType(newObject)
                        .get(1));
            }

            return originBean.getClass() == newObject.getClass();
        }

        return false;
    }


    @SuppressWarnings("unchecked")
    public static Set<Class> getClassesByInterface(String[] filePath, Class interfaceClass) {
        Set<Class> interfaceImpClasses = new HashSet<>();
        Set<Class> classes = new HashSet<>();

        for (String path : filePath) {
            //把前面那个"/"去掉
            Set<Class> set = getAllClass(new File(interfaceClass.getResource("/" + path.replaceAll("\\.", "/")).getPath()),
                    path);
            interfaceImpClasses.addAll(set);
        }

        for (Class clazz : interfaceImpClasses) {
            if (!interfaceClass.isAssignableFrom(clazz)) {
                continue;
            }

            if (!clazz.isInterface() && !clazz.isAnnotation() && !Modifier.isAbstract(clazz.getModifiers())) {
                classes.add(clazz);
            }
        }
        return classes;
    }

    /**
     * @param file        查找路径的File对象 -- 不区分是不是抽象类或者是借口
     * @param packageName 查找的路径（根）
     */
    public static Set<Class> getAllClass(File file, String packageName) {
        Set<Class> classSet = new HashSet<>();
        for (File f : Objects.requireNonNull(file.listFiles())) {

            if (f.isDirectory()) {
                String packageName1 = packageName + "." + f.getName();
                classSet.addAll(getAllClass(f, packageName1));
            } else if (f.getPath().endsWith(".class")) {
                try {
                    classSet.add(Class.forName(packageName + "." + f.getName().replaceAll(".class", "")));
                } catch (ClassNotFoundException e) {
                    //TODO 内部类也会单独生成一个.class文件，也被加入这里面。怎么办？
                    throw new RuntimeException("初始化出错了");
                }
            }
        }
        return classSet;
    }


    /**
     * 我在做方法的反射的时候会遇到就是说去反射java自定义的那些方法的时候，出错。
     * 那这个方法就是说返回所有父类的java的类的方法，我不去反射他们
     */
    public static List<Method> getSuperClassMethod(Class clazz) {
        List<Method> methods = new ArrayList<>();
        if (clazz.getSuperclass() == null) {
            //java自带的类加载器是null
            if (clazz.getClassLoader() == null) {
                methods.addAll(Arrays.asList(clazz.getMethods()));
                return methods;
            } else {
                return methods;
            }
        } else {
            return getSuperClassMethod(clazz.getSuperclass());
        }
    }


    /**
     * 通过这个方法，拿到方法的参数的名称（用户自己定义的）
     * 参考地址：https://blog.csdn.net/mhmyqn/article/details/47294485
     */
    public static String[] getParameterNames(Class<?> clazz, Method method) {
        final Class<?>[] parameterTypes = method.getParameterTypes();
        System.out.println("method name : " + method.getName());
        if (parameterTypes.length == 0) {
            return null;
        }

        //应该还要排除一种情况就是说java自带的方法。我们不处理这类的方法
        List<Method> methods = getSuperClassMethod(clazz);
        if (methods.contains(method)) {
            return null;
        }


        //这边有一个需要注意的就是说如果是static的方法，这边的param的数组数量是正常的，非static方法数量要加一
        String[] parameterNames;
        parameterNames = new String[parameterTypes.length];
        // if (Modifier.isStatic(method.getModifiers())) {
        // } else {
        //     parameterNames = new String[parameterTypes.length + 1];
        // }

        final Type[] types = new Type[parameterTypes.length];
        for (int i = 0; i < parameterTypes.length; i++) {
            types[i] = Type.getType(parameterTypes[i]);
        }

        //拿到类名 比如 org.framework.abc 拿到 abc.class
        String className = clazz.getName().substring(clazz.getName().lastIndexOf(".") + 1) + ".class";
        InputStream is = clazz.getResourceAsStream(className);

        try {
            ClassReader classReader = new ClassReader(is);
            //我们重写了这下面的方法
            classReader.accept(new ClassVisitorUtils(Opcodes.ASM4, method, types, parameterNames), 0);
        } catch (IOException e) {
            throw new RuntimeException("读取类的信息出错了");
        }

        return parameterNames;
    }


    @SuppressWarnings("unchecked")
    public static <T> T newInstance(String className,Class<T> superClass){
        Class<?> classType = null;
        try {
            classType = Class.forName(className);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("生成Class出错",e);
        }

        if(!superClass.isAssignableFrom(classType)){
            throw new RuntimeException("类必须继承" + superClass.getName());
        }

        Class<T> classes = (Class<T>) classType;

        try {
            return classes.newInstance();
        } catch (InstantiationException e) {
            throw new RuntimeException("类实例化出错"+e);
        } catch (IllegalAccessException e) {
            throw new RuntimeException("类实例化出错了" + e);
        }
    }

}
