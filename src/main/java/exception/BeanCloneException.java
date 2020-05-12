/*
 * @(#) BeanCloneException
 * 版权声明 网宿科技, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2018
 * <br> Company:网宿科技
 * <br> @author Administrator
 * <br> @description 功能描述
 * <br> 2018-10-07 17:13:13
 */

package exception;

public class BeanCloneException extends RuntimeException {
    public BeanCloneException() {
        super();
    }

    public BeanCloneException(String message) {
        super(message);
    }

    public BeanCloneException(String message, Throwable cause) {
        super(message, cause);
    }

    public BeanCloneException(Throwable cause) {
        super(cause);
    }

    protected BeanCloneException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
