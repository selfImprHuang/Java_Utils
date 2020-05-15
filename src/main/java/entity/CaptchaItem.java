package entity;

import java.awt.*;

/**
 * 验证码属性设值对象
 */
public class CaptchaItem {

    /**
     * 验证码图片高度
     */
    private double height;

    /**
     * 验证码图片宽度
     */
    private double width;

    /**
     * 验证码长度
     */
    private int codeLength;

    /**
     * 验证码从这里面进行取值
     */
    private String codeValue;

    /**
     * 是否使用随机背景颜色
     */
    private boolean backgroundRandom;

    /**
     * 是否使用随机验证码颜色
     */
    private boolean captchaColorRandom;

    /**
     * 背景颜色
     */
    private int backgroundColor;

    /**
     * 验证码颜色
     */
    private int captchaColor;

    /**
     * 字体属性
     */
    private Font font;

    public CaptchaItem() {
        //直接进行默认值的处理
        this.captchaColorRandom = true;
        this.backgroundRandom = true;
        this.codeLength = 4;
        this.height = 100;
        this.width = 200;
        this.codeValue = "abcdefghijklmnopqrstuvwxyz1234567890";
        this.font = new Font("Algerian", Font.ITALIC, (int)this.height - 4);
    }

    public Font getFont() {
        return font;
    }

    public void setFont(Font font) {
        this.font = font;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        this.width = width;
    }

    public int getCodeLength() {
        return codeLength;
    }

    public void setCodeLength(int codeLength) {
        this.codeLength = codeLength;
    }

    public String getCodeValue() {
        return codeValue;
    }

    public void setCodeValue(String codeValue) {
        this.codeValue = codeValue;
    }

    public boolean isBackgroundRandom() {
        return backgroundRandom;
    }

    public void setBackgroundRandom(boolean backgroundRandom) {
        this.backgroundRandom = backgroundRandom;
    }

    public boolean isCaptchaColorRandom() {
        return captchaColorRandom;
    }

    public void setCaptchaColorRandom(boolean captchaColorRandom) {
        this.captchaColorRandom = captchaColorRandom;
    }

    public int getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(int backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public int getCaptchaColor() {
        return captchaColor;
    }

    public void setCaptchaColor(int captchaColor) {
        this.captchaColor = captchaColor;
    }
}
