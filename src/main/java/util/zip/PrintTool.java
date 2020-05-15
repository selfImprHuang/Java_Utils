package util.zip;

import org.springframework.util.StopWatch;

import java.io.File;

class PrintTool {

    static void calculateTimeAndLength(File[] files, StopWatch stopWatch, File resultFile){
        //计算一下文件的大小
        double length = 0.0000;

        for (File file : files) {
            length = length + file.length();
        }

        System.out.println(
                "文件大小：" + length / 1024.00 / 1024.00 + "M，转换时间：" + stopWatch.getTotalTimeMillis() / 1000.000 + " s," + "压缩后文件大小：" + resultFile
                        .length() / 1024.00 / 1024.00 + " M");
    }
}
