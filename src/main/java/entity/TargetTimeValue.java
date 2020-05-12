

package entity;

/**
 * 补时间点后的对象
 */
public class TargetTimeValue {
    private long time;
    /**
     * 统计值，其中null值表示没有数据
     */
    private Long value;

    public void setTime(long time) {
        this.time = time;
    }

    public void setValue(Long value) {
        this.value = value;
    }

    public long getTime() {
        return time;
    }

    public Long getValue() {
        return value;
    }
}
