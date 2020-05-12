

package entity;

/**
 * 原始的时间点
 * @author huangzj
 */
public class OriginTimeValue {

    /**
     * 时间
     */
    private long time;

    /**
     * 数值
     */
    private long value;

    public OriginTimeValue(long time, long value) {
        this.time = time;
        this.value = value;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public long getValue() {
        return value;
    }

    public void setValue(long value) {
        this.value = value;
    }
}
