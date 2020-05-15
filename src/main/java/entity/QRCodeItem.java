package entity;

import com.google.zxing.EncodeHintType;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import java.awt.*;
import java.util.HashMap;
import java.util.Map;

public class QRCodeItem {


    /**
     * 二维码上面的文字内容
     */
    private String content;

    /**
     * 文字颜色
     */
    private Color contentColor;

    /**
     * 文字字体
     */
    private Font contentFont;

    /**
     * 宽度
     */
    private int width;

    /**
     * 高度
     */
    private int height;

    /**
     * 图片后缀
     */
    private String suffix;

    /**
     * logo的文件地址
     */
    private String logoPath;

    /**
     * 二维码参数,这边会有默认的配置.具体配置可以参考:
     * @see EncodeHintType
     */
    private Map<EncodeHintType,Object> hints = new HashMap<>();


    /**
     * 二维码背景颜色
     */
    private Color backgroundColor;

    /**
     * 二维码条纹颜色
     */
    private Color stripeColor;


    /**
     * 是否自定义文字位置，如果false，直接按照程序里面的设定处理
     */
    private boolean isDiyContentPosition;

    /**
     * 文字的x轴位置
     */
    private int contentX;


    /**
     * 文字的Y轴位置
     */
    private int contentY;


    /**
     * 是否自定义logo位置，如果false，直接按照程序里面的设定处理
     */
    private boolean isDiyLogoPosition;

    /**
     * logo的X轴位置
     */
    private int logoX;

    /**
     * logo的Y轴位置
     */
    private int logoY;

    public QRCodeItem() {
        this.width= this.height = 300;
        this.content = " ";
        this.contentColor =Color.BLACK;
        this.suffix = "png";
        //设置字符集
        this.hints.put(EncodeHintType.CHARACTER_SET,"UTF-8");
        //设置纠错等级，分为四级
        this.hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.Q);
        //设置边框空白边距
        this.hints.put(EncodeHintType.MARGIN,0);
        this.contentFont= new Font("宋体",Font.BOLD, 12);
        this.logoPath = "F:\\Java个人代码\\Java_Utils\\src\\main\\test\\util\\image\\QRCode\\log.png";
        this.backgroundColor = Color.WHITE;
        this.stripeColor = Color.BLACK;
        this.isDiyContentPosition = false;
        this.isDiyLogoPosition = false;
    }

    public String getLogoPath() {
        return logoPath;
    }

    public void setLogoPath(String logoPath) {
        this.logoPath = logoPath;
    }

    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }


    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public Font getContentFont() {
        return contentFont;
    }

    public void setContentFont(Font contentFont) {
        this.contentFont = contentFont;
    }

    public Color getContentColor() {
        return contentColor;
    }

    public void setContentColor(Color contentColor) {
        this.contentColor = contentColor;
    }

    public Map<EncodeHintType,Object> getHints() {
        return hints;
    }

    public void setHints(Map<EncodeHintType,Object> hints) {
        this.hints = hints;
    }

    public Color getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(Color backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public Color getStripeColor() {
        return stripeColor;
    }

    public void setStripeColor(Color stripeColor) {
        this.stripeColor = stripeColor;
    }

    public boolean isDiyContentPosition() {
        return isDiyContentPosition;
    }

    public void setDiyContentPosition(boolean diyContentPosition) {
        isDiyContentPosition = diyContentPosition;
    }

    public int getContentX() {
        return contentX;
    }

    public void setContentX(int contentX) {
        this.contentX = contentX;
    }

    public int getContentY() {
        return contentY;
    }

    public void setContentY(int contentY) {
        this.contentY = contentY;
    }

    public boolean isDiyLogoPosition() {
        return isDiyLogoPosition;
    }

    public void setDiyLogoPosition(boolean diyLogoPosition) {
        isDiyLogoPosition = diyLogoPosition;
    }

    public int getLogoX() {
        return logoX;
    }

    public void setLogoX(int logoX) {
        this.logoX = logoX;
    }

    public int getLogoY() {
        return logoY;
    }

    public void setLogoY(int logoY) {
        this.logoY = logoY;
    }
}
