package util.image;

import entity.CaptchaItem;
import util.FileUtil;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Random;

/**
 * 验证码生成工具
 *                  参考地址：http://blog.csdn.net/ruixue0117/article/details/22829557
 *                  参考地址：http://www.iteye.com/topic/573456
 */
public class CaptchaUtil {
    /**
     * 验证码处理对象，这边直接采用默认的配置，可以通过set方式进行设置
     */
    private  CaptchaItem captchaItem = new CaptchaItem();


    /**
     * 可支持生成随机验证码
     */
    public String generalCode() {
        StringBuilder generalCode = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < captchaItem.getCodeLength(); i++) {
            int position = random.nextInt(captchaItem.getCodeValue().length()-1);
            generalCode.append(captchaItem.getCodeValue().charAt(position));
        }
        return generalCode.toString();
    }

    /**
     * 生成验证码图片.这边可支持自定义的code传入
     * @param imagePath 图片地址
     * @param captchaCode 验证码数值
     */
    public void generateCaptchaImage(String imagePath, String captchaCode){
       File imageFile = FileUtil.createGetFile(imagePath);
       if(imageFile == null){
           throw new RuntimeException("文件不存在或者生成失败");
       }
        BufferedImage image = generateBufferedImage(captchaCode);
        try {
            ImageIO.write(image, "jpg",  new FileOutputStream(imageFile));
        } catch (IOException e) {
            throw new RuntimeException("文件生成失败");
        }
    }

    /**
     * 生成验证码图片.code按照设定的方式进行处理
     * @param imagePath 图片地址
     */
    public void generateCaptchaImage(String imagePath){
        File imageFile = FileUtil.createGetFile(imagePath);
        if(imageFile == null){
            throw new RuntimeException("文件不存在或者生成失败");
        }
        BufferedImage image = generateBufferedImage(generalCode());
        try {
            ImageIO.write(image, "jpg",  new FileOutputStream(imageFile));
        } catch (IOException e) {
            throw new RuntimeException("文件生成失败");
        }
    }


    /**
     * 设置BufferedImage对象，实现图片流的处理
     */
    private  BufferedImage generateBufferedImage(String captchaCode){
        BufferedImage bi = new BufferedImage((int)captchaItem.getWidth(), (int)captchaItem.getHeight() , BufferedImage.TYPE_INT_RGB);
        Graphics2D g2 = bi.createGraphics();
        //判断是否生成随机颜色还是通过设置的颜色进行处理
        Color backColor =captchaItem.isBackgroundRandom()? getColor(new Random().nextInt(100), new Random().nextInt(200)+100): getColor(captchaItem.getCaptchaColor(),captchaItem.getCaptchaColor());
        //设置背景色
        setColorTone(g2,backColor);
        //设置干扰线
        setVictimLine(g2);
        // 添加噪点
        setHotPixel(bi);
        // 使图片扭曲
        shear(g2, (int)captchaItem.getWidth(), (int)captchaItem.getHeight(), backColor);
        //设置写入文字的属性以及验证码
        setCaptchaCode(g2,captchaCode);
        g2.dispose();
        return bi;
    }

    private  void setCaptchaCode(Graphics2D g2, String captchaCode) {
        Color fontColor =captchaItem.isCaptchaColorRandom()? getColor(new Random().nextInt(100), new Random().nextInt(200)+100): getColor(captchaItem.getCaptchaColor(),captchaItem.getCaptchaColor());
        g2.setColor(fontColor);
        double fontSize = captchaItem.getHeight() - 4;
        g2.setFont(captchaItem.getFont());
        char[] chars = captchaCode.toCharArray();

        for (int i = 0; i < captchaCode.length(); i++) {
            AffineTransform transform = new AffineTransform();
            transform.setToRotation(Math.PI / 4 * new Random().nextDouble() * (new Random().nextBoolean() ? 1 : -1),
                    (captchaItem.getWidth() / captchaCode.length()) * i + fontSize / 2, captchaItem.getHeight() / 2);
            g2.setTransform(transform);
            g2.drawChars(chars, i, 1, (int)((captchaItem.getWidth() - 10) / captchaCode.length()) * i + 5, (int)(captchaItem.getHeight() / 2 + fontSize / 2 - 10));
        }
    }

    private  void setHotPixel(BufferedImage bi) {
        Random random = new Random();
        // 噪声率
        float yawpRate = 0.05f;
        int area = (int) (yawpRate * captchaItem.getWidth() * captchaItem.getHeight());
        for (int i = 0; i < area; i++) {
            int x = random.nextInt((int)captchaItem.getWidth());
            int y = random.nextInt((int)captchaItem.getHeight());
            int rgb = getRandomIntColor();
            bi.setRGB(x, y, rgb);
        }
    }

    private  void setVictimLine(Graphics2D g2) {
        //绘制干扰线 设置线条的颜色
        Random random = new Random();
        g2.setColor(getColor(160, 200));
        for (int i = 0; i < 20; i++) {
            int x = random.nextInt((int)captchaItem.getWidth() - 1);
            int y = random.nextInt((int)captchaItem.getHeight() - 1);
            int xl = random.nextInt(6) + 1;
            int yl = random.nextInt(12) + 1;
            g2.drawLine(x, y, x + xl + 40, y + yl + 20);
        }
    }

    private  void setColorTone(Graphics2D g2,Color backColor) {
        //设置色调
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        // 设置边框色
        g2.setColor(Color.GRAY);
        g2.fillRect(0, 0,(int)captchaItem.getWidth(), (int)captchaItem.getHeight() );
        // 设置背景色
        g2.setColor(backColor);
        g2.fillRect(0, 2,(int)captchaItem.getWidth(), (int)captchaItem.getHeight() - 4);
    }

    private  int getRandomIntColor() {
        int[] rgb = getRandomRgb();
        int color = 0;
        for (int c : rgb) {
            color = color << 8;
            color = color | c;
        }
        return color;
    }

    private  int[] getRandomRgb() {
        int[] rgb = new int[3];
        for (int i = 0; i < 3; i++) {
            rgb[i] = new Random().nextInt(255);
        }
        return rgb;
    }


    //图片扭曲
    private  void shear(Graphics g, int w1, int h1, Color color) {
        shearX(g, w1, h1, color);
        shearY(g, w1, h1, color);
    }

    private  void shearX(Graphics g, int w1, int h1, Color color) {
        int period = new Random().nextInt(2);
        int frames = 1;
        int phase = new Random().nextInt(2);
        for (int i = 0; i < h1; i++) {
            double d = (double) (period >> 1)
                    * Math.sin((double) i / (double) period
                    + (6.2831853071795862D * (double) phase)
                    / (double) frames);
            g.copyArea(0, i, w1, 1, (int) d, 0);
            g.setColor(color);
            g.drawLine((int) d, i, 0, i);
            g.drawLine((int) d + w1, i, w1, i);
        }
    }

    private  void shearY(Graphics g, int w1, int h1, Color color) {
        int period = new Random().nextInt(40) + 10;
        int frames = 20;
        int phase = 7;
        for (int i = 0; i < w1; i++) {
            double d = (double) (period >> 1)
                    * Math.sin((double) i / (double) period
                    + (6.2831853071795862D * (double) phase)
                    / (double) frames);
            g.copyArea(i, 0, 1, h1, 0, (int) d);
            g.setColor(color);
            g.drawLine(i, (int) d, i, 0);
            g.drawLine(i, (int) d + h1, i, h1);
        }
    }

    /**
     * 生成随机背景颜色
     */
    private  Color getColor(int fc, int bc) {
        if (fc > 255){
            fc = 254;
        }
        if (bc > 255){
            bc = 255;
        }
        int r = fc + new Random().nextInt(bc - fc);
        int g = fc + new Random().nextInt(bc - fc);
        int b = fc + new Random().nextInt(bc - fc);
        return new Color(r, g, b);
    }


    /**
     * -------------------------------对验证码对象进行查看和设置值----------------------
     */
    public   CaptchaItem getCaptchaItem() {
        return captchaItem;
    }

    public  void setCaptchaItem(CaptchaItem captchaItem1) {
        captchaItem = captchaItem1;
    }
}
