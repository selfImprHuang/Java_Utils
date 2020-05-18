package util.transform;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.io.IOException;

/**
 * @author: 志军
 * @description: json对象转java对象，java对象转json
 * @date: 2017/12/25 18:01
 */
public class JsonBinder {


    public static <T> T fromJson(String json, Class<T> type) {
        try {
            ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();
            return objectMapper.readValue(json, type);
        } catch (JsonParseException | JsonMappingException e) {
            throw  new RuntimeException("JsonParseException | JsonMappingException 错误", e);
        } catch (IOException e) {
            throw  new RuntimeException("IOException 错误", e);
        }
    }

    public static String toJson(Object object) {
        try {
            ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw  new RuntimeException("对象转换为json字符串失败", e);
        }
    }
}
