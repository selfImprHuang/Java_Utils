package util.image;

import java.awt.*;
import java.awt.image.BufferedImage;

public class QRCodeUtilTest {

    public static void main(String[] args) {
        QRCodeUtil qrCodeUtil = new QRCodeUtil();
        qrCodeUtil.getQrCodeItem().setContent("我测试一下");
        qrCodeUtil.getQrCodeItem().setContentFont(new Font("宋体",Font.BOLD, 12));
        qrCodeUtil.getQrCodeItem().setContentColor(Color.RED);
        BufferedImage bufferedImage =  qrCodeUtil.createQrCodeImage();
        qrCodeUtil.createQrCodeWithImage("F:\\Java个人代码\\Java_Utils\\src\\main\\test\\util\\image\\QRCode\\default.jpg",bufferedImage);

        BufferedImage bufferedImage1 =  qrCodeUtil.createQrCodeImage();
        bufferedImage1 = qrCodeUtil.drawContent(bufferedImage1);
        qrCodeUtil.createQrCodeWithImage("F:\\Java个人代码\\Java_Utils\\src\\main\\test\\util\\image\\QRCode\\content.jpg",bufferedImage1);

        BufferedImage bufferedImage2 =  qrCodeUtil.createQrCodeImage();
        bufferedImage2 = qrCodeUtil.drawLogo(bufferedImage2);
        qrCodeUtil.createQrCodeWithImage("F:\\Java个人代码\\Java_Utils\\src\\main\\test\\util\\image\\QRCode\\logo1.jpg",bufferedImage2);

        BufferedImage bufferedImage3 =  qrCodeUtil.createQrCodeImage();
        bufferedImage3 = qrCodeUtil.drawLogo(bufferedImage3);
        bufferedImage3 = qrCodeUtil.drawContent(bufferedImage3);
        qrCodeUtil.createQrCodeWithImage("F:\\Java个人代码\\Java_Utils\\src\\main\\test\\util\\image\\QRCode\\logoContent.jpg",bufferedImage3);


    }

}
