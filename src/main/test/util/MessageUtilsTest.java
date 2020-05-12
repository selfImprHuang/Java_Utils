package util;

public class MessageUtilsTest {


    public static void main(String[] args) {
        String  pattern = "{0}----{1}======={2}_______{3}";
        System.out.println(MessageUtils.format(pattern,"我是零","我是一","我是2","我是三"));
        System.out.println(MessageUtils.format(pattern,"我是零","我是一"));
        System.out.println(MessageUtils.format(pattern,"我是零","我是一","我是2","我是三","我是多的","我又多了"));
        xxx[] a = new xxx[] {new xxx("123",222),new xxx("123",555),new xxx("999",222)};
        System.out.println(MessageUtils.format(pattern,a));

        String i = "{ --},{}";
        System.out.println(MessageUtils.format(i,"我是零","我是一"));
        System.out.println(MessageUtils.format(i,a));

    }
}

class xxx{
    String a;
    int b;

    public xxx(String a, int b) {
        this.a = a;
        this.b = b;
    }
}
