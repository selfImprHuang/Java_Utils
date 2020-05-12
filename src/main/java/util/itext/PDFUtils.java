

package util.itext;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.tool.xml.ElementList;
import com.itextpdf.tool.xml.html.Tags;

import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by huangzhijun on 2017/8/22.
 * itext 用于生成pdf的工具类
 */
public class PDFUtils {
    /**
     * 通过模板生成pdf文件
     *
     * @param templatePath 模板路径
     * @param resultPath 生成路径
     * @param cssPath css路径
     * @param content 生成pdf的内容
     * @throws Exception
     */
    public static void generalPDF(String templatePath, String resultPath, String cssPath, String content) throws Exception {
        // 读取模板
        FillTemplateHelper template = new FillTemplateHelper(templatePath);
        Document document = new Document(template.getPageSize(),
            template.getmLeft(), template.getmRight(), template.getmTop(), template.getmBottom());
        // 创建pdf写对象
        PdfWriter writer = null;
        FileOutputStream outputStream = new FileOutputStream(resultPath);
        try {
            writer = PdfWriter.getInstance(document, outputStream);
        } catch (Exception e) {
            e.printStackTrace();
        }
        writer.setPageEvent(template);
        //打开文件
        document.open();
        // 填充数据到文件中
        ElementList elements = FillTemplateHelper.parseHtmlContent(content, cssPath, Tags.getHtmlTagProcessorFactory());
        for (Element e : elements) {
            document.add(e);
        }
        writer.setPageEmpty(false);
        //关闭流操作
        document.close();
        writer.close();
        outputStream.close();
    }

    /**
     *  PDF盖章操作
     * 在PDF文档的最后一页盖章
     * @param RES 需要盖章的pdf文件地址
     * @param DEST 生成的新pdf文件地址
     * @param SEAL 印章图片的地址
     * @param company 落款名称及部门
     * @param dateName 落款时间名称
     * @throws DocumentException
     * @throws IOException
     */
    public static void sealDocument(String RES, String DEST, String SEAL, String company, String dateName, String time) throws DocumentException, IOException {

        PdfReader reader = new PdfReader(RES);
        int numberOfPages = reader.getNumberOfPages();
        Rectangle pageSize = reader.getPageSize(1);
        Document doc = new Document(pageSize);
        PdfWriter writer_ = PdfWriter.getInstance(doc, new FileOutputStream(DEST));
        // 打开文档
        doc.open();
        PdfContentByte cb = writer_.getDirectContent();
        for (int i = 0; i < numberOfPages; ) {
            {
                i++;
                //设置指定页的PagSize 包含Rotation（页面旋转度）
//                doc.setPageSize(reader.getPageSizeWithRotation(i));
                //创建一个新的页面，需要注意的调用NewPage() ，PdfContentByte cb 对象会默认清空
                doc.newPage();
//                //获取指定页面的旋转度
//                int rotation = reader.getPageRotation(i);
                //获取加载PDF的指定页内容
                PdfImportedPage page1 = writer_.getImportedPage(reader, i);

                //添加内容页到新的页面，并更加旋转度设置对应的旋转
               /* switch (rotation) {
                    case 90:
                        cb.addTemplate(page1, 0, -1, 1, 0, 0, reader.getPageSizeWithRotation(i).getHeight());
                        break;
                    case 180:
                        cb.addTemplate(page1, -1, 0, 0, -1, reader.getPageSizeWithRotation(i).getWidth(), reader.getPageSizeWithRotation(i).getHeight());
                        break;
                    case 270:
                        cb.addTemplate(page1, 0, 1, -1, 0, reader.getPageSizeWithRotation(i).getWidth(), 0);
                        break;
                    default:
                        cb.addTemplate(page1, 1, 0, 0, 1, 0, 0);//等同于 cb.AddTemplate(page1, 0,0)
                        break;
                }*/
                cb.addTemplate(page1, 0, 0);

                if (i == numberOfPages)//如果是最后一页加入指定的图片
                {
                    //创建一个图片对象
                    Image img = Image.getInstance(SEAL);
                    //设置图片的指定大小
                    //img.ScaleToFit(140F, 320F);
                    //按比例缩放
                    img.scalePercent(100);
                    BaseFont bf = BaseFont.createFont("STSong-Light", "UniGB-UCS2-H", com.itextpdf.text.pdf.BaseFont.NOT_EMBEDDED);
                    cb.beginText();
                    //设置字体 大小
                    cb.setFontAndSize(bf, 13);
                    //指定添加文字的绝对位置
                    cb.setTextMatrix(350, 75);
                    //增加文本
                    cb.showText(company);
                    //结束
                    cb.endText();
                    cb.beginText();
                    //设置字体 大小
                    cb.setFontAndSize(bf, 13);
                    //指定添加文字的绝对位置
                    cb.setTextMatrix(350, 55);
                    if (org.apache.commons.lang3.StringUtils.isBlank(time)) {
                        Date date = new Date();
                        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                        time = format.format(date);
                    }
                    //增加文本
                    cb.showText(dateName + "：" + time);
                    //结束
                    cb.endText();
                    //把图片增加到内容页的指定位子  b width c height  e bottom f left
//                    use addImage(image, image_width, 0, 0, image_height, x, y)
                    cb.addImage(img, 130, 0, 0, 130, 400, 55);
                }
            }
        }
        System.out.println("盖章成功");
        doc.close();
        writer_.close();
        reader.close();

    }

    /**
     * 将页面传过来的内容重新组装为html
     * @param content
     * @return
     */
    public String transToHtml(String content) {
        StringBuffer sb = new StringBuffer();
        sb.append("<html>");
        sb.append("<head>");
        sb.append("<meta charset=\"UTF-8\" />");
        sb.append("</head>");
        sb.append("<body style='font-family:SimSun;'>");
        sb.append("<div class=\"executed-report\">");
        sb.append("<div class=\"report-box clearfix\">");
        sb.append(content);
        sb.append("</div>");
        sb.append("</div>");
        sb.append("</body>");
        sb.append("</html>");
        return sb.toString();
    }


}
