/*
 * @(#) FillTemplateHelper
 * 版权声明 网宿科技, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2018
 * <br> Company:网宿科技
 * <br> @author Administrator
 * <br> @description 功能描述
 * <br> 2018-11-13 20:19:49
 */

package util.itext;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.tool.xml.ElementList;
import com.itextpdf.tool.xml.XMLWorker;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import com.itextpdf.tool.xml.css.CssFile;
import com.itextpdf.tool.xml.css.StyleAttrCSSResolver;
import com.itextpdf.tool.xml.html.TagProcessorFactory;
import com.itextpdf.tool.xml.parser.XMLParser;
import com.itextpdf.tool.xml.pipeline.css.CSSResolver;
import com.itextpdf.tool.xml.pipeline.css.CssResolverPipeline;
import com.itextpdf.tool.xml.pipeline.end.ElementHandlerPipeline;
import com.itextpdf.tool.xml.pipeline.html.HtmlPipeline;
import com.itextpdf.tool.xml.pipeline.html.HtmlPipelineContext;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;

/**
 * @author iText
 */
public class FillTemplateHelper extends PdfPageEventHelper {

    // initialized in constructor
    protected PdfReader reader;
    protected Rectangle pageSize;
    protected Rectangle body;
    protected float mLeft, mRight, mTop, mBottom;
    protected Rectangle to;
    protected Rectangle from;
    protected Rectangle date;
    protected Rectangle footer;
    protected BaseFont basefont;
    protected Font font;
    // initialized with setter
    protected String sender = "";
    protected String receiver = "";
    // initialized upon opening the document
    protected PdfTemplate background;
    protected PdfTemplate total;

    public FillTemplateHelper(String stationery) throws IOException, DocumentException {
        reader = new PdfReader(stationery);
        AcroFields fields = reader.getAcroFields();
        pageSize = reader.getPageSize(1);
        body = fields.getFieldPositions("body").get(0).position;
        mLeft = body.getLeft() - pageSize.getLeft();
        mRight = pageSize.getRight() - body.getRight();
        mTop = pageSize.getTop() - body.getTop();
        mBottom = body.getBottom() - pageSize.getBottom();
        footer = fields.getFieldPositions("footer").get(0).position;
        basefont = BaseFont.createFont("STSong-Light", "UniGB-UCS2-H", BaseFont.NOT_EMBEDDED);
        font = new Font(basefont, 12);

    }

    public static ElementList parseHtml(String content, String style, TagProcessorFactory tagProcessors) throws IOException {
        // CSS
        CSSResolver cssResolver = new StyleAttrCSSResolver();
        CssFile cssFile = XMLWorkerHelper.getCSS(new FileInputStream(style));
        cssResolver.addCss(cssFile);
        // HTML
        HtmlPipelineContext htmlContext = new HtmlPipelineContext(null);
        htmlContext.setTagFactory(tagProcessors);
        htmlContext.autoBookmark(false);
        // Pipelines
        ElementList elements = new ElementList();
        ElementHandlerPipeline end = new ElementHandlerPipeline(elements, null);
        HtmlPipeline html = new HtmlPipeline(htmlContext, end);
        CssResolverPipeline css = new CssResolverPipeline(cssResolver, html);
        // XML Worker
        XMLWorker worker = new XMLWorker(css, true);
        XMLParser p = new XMLParser(worker);
        p.parse(new FileInputStream(content), Charset.forName("utf8"));
        return elements;
    }

    public static ElementList parseHtmlContent(String content, String style, TagProcessorFactory tagProcessors) throws IOException {
        // CSS
        CSSResolver cssResolver = new StyleAttrCSSResolver();
        CssFile cssFile = XMLWorkerHelper.getCSS(new FileInputStream(style));
        cssResolver.addCss(cssFile);
        // HTML
        HtmlPipelineContext htmlContext = new HtmlPipelineContext(null);
        htmlContext.setTagFactory(tagProcessors);
        htmlContext.autoBookmark(false);
        // Pipelines
        ElementList elements = new ElementList();
        ElementHandlerPipeline end = new ElementHandlerPipeline(elements, null);
        HtmlPipeline html = new HtmlPipeline(htmlContext, end);
        CssResolverPipeline css = new CssResolverPipeline(cssResolver, html);
        // XML Worker
        XMLWorker worker = new XMLWorker(css, true);
        XMLParser p = new XMLParser(worker);
        try {
            p.parse(getStringStream(content), Charset.forName("utf8"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return elements;
    }

    public static InputStream getStringStream(String sInputString) {
        if (sInputString != null && !sInputString.trim().equals("")) {
            try {
                ByteArrayInputStream tInputStringStream = new ByteArrayInputStream(sInputString.getBytes("UTF-8"));
                return tInputStringStream;
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        return null;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public Rectangle getPageSize() {
        return pageSize;
    }

    public float getmLeft() {
        return mLeft;
    }

    public float getmRight() {
        return mRight;
    }

    public float getmTop() {
        return mTop;
    }

    public float getmBottom() {
        return mBottom;
    }

    public Rectangle getBody() {
        return body;
    }

    @Override
    public void onOpenDocument(PdfWriter writer, Document document) {
        background = writer.getImportedPage(reader, 1);
        total = writer.getDirectContent().createTemplate(30, 15);
    }

    @Override
    public void onEndPage(PdfWriter writer, Document document) {
        PdfContentByte canvas = writer.getDirectContentUnder();
        // background
        canvas.addTemplate(background, 0, 0);
        try {
            ColumnText ct = new ColumnText(canvas);
            ct.setSimpleColumn(footer);
            ct.addText(new Chunk("        " + writer.getPageNumber(), font));
            ct.addText(new Chunk(Image.getInstance(total), 0, 0));
            ct.go();
        } catch (DocumentException e) {
            // can never happen, but if it does, we want to know!
            throw new ExceptionConverter(e);

        }
    }

    @Override
    public void onCloseDocument(PdfWriter writer, Document document) {
        // 关闭时可以知道总页数，写入页码
        String s = "/ " + (writer.getPageNumber());
        Phrase p = new Phrase(12, s, font);
        ColumnText.showTextAligned(total, Element.ALIGN_LEFT, p, 0.5f, 0, 0);
    }


}