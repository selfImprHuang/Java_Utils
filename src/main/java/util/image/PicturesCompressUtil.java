package util.image;

import net.coobird.thumbnailator.Thumbnails;
import util.FileUtil;

import java.io.IOException;

public class PicturesCompressUtil {
    /**
     * 设置压缩之后的图片比例(默认比例是50%)
     */
    private float scale = (float)0.5;

    public float getScale() {
        return scale;
    }

    public void setScale(float scale) {
        this.scale = scale;
    }

    public void compress(String srcPath, String desPath) throws IOException {
       if ( !FileUtil.fileExist(srcPath)){
           throw new RuntimeException("文件路径不存在");
       }
        Thumbnails.of(srcPath).scale(scale).toFile(desPath);
    }
}
