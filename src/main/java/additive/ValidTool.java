package additive;

public class ValidTool {

    public static void assertIsTrue(boolean expression, String message) {
        if (!expression) {
            throw new IllegalArgumentException(message);
        }
    }
}
