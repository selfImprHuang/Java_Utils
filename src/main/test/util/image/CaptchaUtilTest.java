package util.image;

public class CaptchaUtilTest {


    public static void main(String[] args) {
        CaptchaUtil captchaUtil = new CaptchaUtil();
        System.out.println(captchaUtil.generalCode());
        captchaUtil.generateCaptchaImage("F:\\Java个人代码\\Java_Utils\\src\\main\\test\\util\\image\\captcha\\test.jpg");
        //自定义code的处理
        captchaUtil.generateCaptchaImage("F:\\Java个人代码\\Java_Utils\\src\\main\\test\\util\\image\\captcha\\test1.jpg","xy2312sa");
    }
}
