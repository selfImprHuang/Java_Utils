package util.transform;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import java.io.*;

/**
 * Xml的转换需要在对象的class上加上@XmlRootElement注释，在属性上加上@XmlElement注释
 * @author 志军
 * {@XmlRootElement(name = "xml")
 *      @XmlAccessorType(XmlAccessType.FIELD)
 *      static class JsonObject {
 *         @XmlElement(name = "x1")
 *         int x1;
 *         @XmlElement(name = "x2")
 *         String x2;
 *         @XmlElement(name = "x3")
 *         JsonObject x3;
 *          get..set...
 * }
 *
 */
public class XmlBinder {


    /**
     * 将对象转化成xml字符串
     */
    static String convertToXml(Object object) {
        //创建输出流
        StringWriter writer = new StringWriter();

        try {
            Marshaller marshaller = getMarshaller(object);
            marshaller.marshal(object, writer);
        } catch (JAXBException e) {
            throw new RuntimeException("解析错误", e);
        }
        return writer.toString();
    }

    /**
     * 将对象转换为xml文件
     */
    static void convertToXml(Object object, String path){
        FileWriter writer;
        try {
            Marshaller marshaller = getMarshaller(object);
            writer =  new FileWriter(path);
            marshaller.marshal(object,writer);
        } catch (JAXBException | IOException e) {
            throw new RuntimeException("转换失败",e);
        }
    }

    /**
     * 将字符串形式的xml转化成对象
     */
    @SuppressWarnings("unchecked")
    static <T> T convertXmlStrToObject(String xml, Class<T> clazz){
        T xmlObject = null;
        try {
            Unmarshaller unmarshaller = getUnmarshaller(clazz);
            StringReader reader = new StringReader(xml);
            xmlObject = (T)unmarshaller.unmarshal(reader);
        } catch (JAXBException e) {
            throw  new RuntimeException("解析错误", e);
        }
        return xmlObject;
    }

    /**
     * 从文件中转换出类
     */
    public static Object convertXmlFileToObject(String path,Class clazz){
        try {
            Unmarshaller unmarshaller = getUnmarshaller(clazz);
            FileReader reader = new FileReader(path);
            return unmarshaller.unmarshal(reader);
        } catch (JAXBException | FileNotFoundException e) {
            throw  new RuntimeException("解析错误", e);
        }
    }


    /**
     * 公共方法 --得到JAXB用于对象转化为xml
     */
    private static Marshaller getMarshaller(Object object) throws JAXBException {
        //利用java的类生成实例
        JAXBContext jaxbContext = JAXBContext.newInstance(object.getClass());
        Marshaller marshaller = jaxbContext.createMarshaller();
        //格式化xml输出格式 --格式化
        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
        marshaller.setProperty(Marshaller.JAXB_ENCODING,"UTF-8");
        return marshaller;
    }

    /**
     * 公共方法 --得到JAXB用于xml转化为对象
     */
    private static Unmarshaller getUnmarshaller(Class clazz) throws JAXBException {
        JAXBContext context = JAXBContext.newInstance(clazz);
        return context.createUnmarshaller();
    }
}
