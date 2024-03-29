//package com.project.model;
//
//import com.fasterxml.jackson.core.JsonParser;
//import com.fasterxml.jackson.databind.DeserializationContext;
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
//import org.apache.kafka.common.header.Header;
//
//import java.io.IOException;
//
//public class HeaderDeserializer extends StdDeserializer<Header> {
//    public HeaderDeserializer() {
//        this(null);
//    }
//
//    public HeaderDeserializer(Class<?> vc) {
//        super(vc);
//    }
//
//    @Override
//    public Header deserialize(JsonParser jp, DeserializationContext ctxt)
//            throws IOException {
//        JsonNode node = jp.getCodec().readTree(jp);
//        String key = node.get("key").asText();
//        String value = node.get("value").asText();
//        return new YourHeaderClass(key, value);
//    }
//}
