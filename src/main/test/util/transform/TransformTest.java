package util.transform;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

public class TransformTest {

    public static void main(String[] args) {
        System.out.println("测试JsonBinder");

        JsonObject jsonObject = new JsonObject();
        jsonObject.setX1(123);
        jsonObject.setX2("123");
        jsonObject.setX3(new JsonObject());
        String jsonString = JsonBinder.toJson(jsonObject);
        System.out.println(jsonString);
        System.out.println(JsonBinder.fromJson(jsonString, JsonObject.class).getX2());

        System.out.println("测试XmlBinder");
        String xmlString = XmlBinder.convertToXml(jsonObject);
        System.out.println(xmlString);

        System.out.println(XmlBinder.convertXmlStrToObject(xmlString,JsonObject.class).getX2());
        XmlBinder.convertToXml(jsonObject,"F:\\Java个人代码\\Java_Utils\\src\\main\\test\\util\\transform\\transform.xml");
    }

    @XmlRootElement(name = "xml")
    @XmlAccessorType(XmlAccessType.FIELD)
    static class JsonObject {
        @XmlElement(name = "x1")
        int x1;
        @XmlElement(name = "x2")
        String x2;
        @XmlElement(name = "x3")
        JsonObject x3;

        public int getX1() {
            return x1;
        }

        public void setX1(int x1) {
            this.x1 = x1;
        }

        public String getX2() {
            return x2;
        }

        public void setX2(String x2) {
            this.x2 = x2;
        }

        public JsonObject getX3() {
            return x3;
        }

        public void setX3(JsonObject x3) {
            this.x3 = x3;
        }
    }
}
