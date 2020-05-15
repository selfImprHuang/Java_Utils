package util.image;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import entity.QRCodeItem;
import org.apache.commons.lang3.StringUtils;
import util.FileUtil;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

/**
 *  @author 黄志军
 *  二维码生成工具
 *  参考地址：http://blog.csdn.net/fly_to_the_winds/article/details/62042142
 */
public class QRCodeUtil {

    private QRCodeItem qrCodeItem = new QRCodeItem();

    /**
     * 生成一个最原始的二维码图片对象,后面的方法可以用于自由组合或者直接该方法输出图片
     */
    public BufferedImage createQrCodeImage(){
        BufferedImage image;
        try {
            MultiFormatWriter  multiFormatWriter = new MultiFormatWriter();
            //这边如果内容为""或者为空会报错，如果没有内容用" "给他
            String content = StringUtils.isBlank(qrCodeItem.getContent())?" ":qrCodeItem.getContent();
            // 参数顺序分别为：编码内容，编码类型，生成图片宽度，生成图片高度，设置参数 (这边会设置参数但是如果不调用logo和content相关的代码，依然不会生成对应的图片和文字)
            BitMatrix bm = multiFormatWriter.encode(content, BarcodeFormat.QR_CODE, qrCodeItem.getWidth(), qrCodeItem.getHeight(), qrCodeItem.getHints());
            int w = bm.getWidth();
            int h = bm.getHeight();
            image = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
            // 开始利用二维码数据创建Bitmap图片，分别设为黑（0xFFFFFFFF）白（0xFF000000）两色
            for (int x = 0; x < w; x++) {
                for (int y = 0; y < h; y++) {
                    image.setRGB(x, y, bm.get(x, y) ? qrCodeItem.getStripeColor().getRGB() : qrCodeItem.getBackgroundColor().getRGB());
                }
            }
        } catch (WriterException e) {
          throw new RuntimeException("生成BufferedImage失败");
        }
        return image;
    }


    /**
     * 通过BufferedImage进行logo绘制，这边返回一个携带logo信息的BufferedImage对象
     */
    public BufferedImage drawLogo(BufferedImage image){
        try {
            Graphics2D g2 = image.createGraphics();
            //logo
            File logoPic = new File(qrCodeItem.getLogoPath());
            BufferedImage logo = ImageIO.read(logoPic);
            //设置logo大小
            int widthLogo = logo.getWidth(null)>image.getWidth()*3/10?(image.getWidth()*3/10):logo.getWidth(null),
                    heightLogo = logo.getHeight(null)>image.getHeight()*3/10?(image.getHeight()*3/10):logo.getWidth(null);
            //开始绘制图片
            if (qrCodeItem.isDiyLogoPosition()){
                g2.drawImage(logo, qrCodeItem.getLogoX(),qrCodeItem.getLogoY() ,widthLogo, heightLogo, null);
            }else{
                g2.drawImage(logo, (image.getWidth() - widthLogo) / 2,  (image.getHeight() - heightLogo) / 2, widthLogo, heightLogo, null);
            }
            g2.dispose();
            logo.flush();
            return image;
        } catch (IOException e) {
           throw new RuntimeException("画logo失败了");
        }
    }

    /**
     * 通过BufferedImage进行内容的绘制，这边返回一个携带内容的BufferedImage对象
     * 这边只是提供一个简单的模板写法，如果需要根据文字内容进行自适应需要修改这么方法的写法
     */
    public BufferedImage drawContent(BufferedImage image){
            BufferedImage image1 = null;
            //在文字内容不为空的情况下进行处理
            if(StringUtils.isNotBlank(qrCodeItem.getContent())){
                //生成新的画板
                image1 = new BufferedImage(qrCodeItem.getWidth(),qrCodeItem.getHeight(),BufferedImage.TYPE_4BYTE_ABGR);
                Graphics2D g2 = image1.createGraphics();
                //将二维码画在新画板上
                g2.drawImage(image,0,0, qrCodeItem.getWidth(),qrCodeItem.getHeight(),null);
                //设置画笔信息
                g2.setColor(qrCodeItem.getContentColor());
                g2.setFont(qrCodeItem.getContentFont());
                //这里不判断文字的长度，只设置书写一行的文字。
                if(qrCodeItem.isDiyContentPosition()){
                    g2.drawString(qrCodeItem.getContent(),qrCodeItem.getContentX(),qrCodeItem.getContentY());
                }else{
                    int strWidth = g2.getFontMetrics().stringWidth(qrCodeItem.getContent());
                    g2.drawString(qrCodeItem.getContent(),(qrCodeItem.getWidth()-strWidth)/2,image.getHeight()-g2.getFont().getSize() -10);
                }
                g2.dispose();
                image1.flush();
            }
            return image1==null? image : image1;
    }

    public void createQrCodeWithImage(String filePath, BufferedImage image){
       File file =  FileUtil.createGetFile(filePath);
       if (file == null){
           throw new RuntimeException("文件不存在或者创建失败");
       }
        try {
            ImageIO.write(image,qrCodeItem.getSuffix(),file);
        } catch (IOException e) {
            throw new RuntimeException("文件创建失败");
        }
    }


    /**
     * -------------------------------对二维码对象进行查看和设置值----------------------
     */
    public QRCodeItem getQrCodeItem() {
        return qrCodeItem;
    }

    public void setQrCodeItem(QRCodeItem qrCodeItem) {
        this.qrCodeItem = qrCodeItem;
    }
}
