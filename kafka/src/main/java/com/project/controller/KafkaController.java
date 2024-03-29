package com.project.controller;

//import com.project.model.KafkaMessageRequest;
import com.project.model.KafkaTemplate;
import com.project.model.MessageRequest;
import com.project.service.KafkaService;
import org.apache.kafka.common.header.Header;
import org.apache.kafka.common.header.internals.RecordHeader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kafka")
@CrossOrigin(origins = "*")
public class KafkaController {

    private final KafkaService kafkaService;

    @Autowired
    public KafkaController(KafkaService kafkaService) {
        this.kafkaService = kafkaService;
    }

    @PostMapping("/post-message")
    public ResponseEntity<?> postMessageToKafka(@RequestBody MessageRequest messageRequest) {
        try {
            String result = kafkaService.postMessageToKafka(
                    messageRequest.getBootstrapServers(),
                    messageRequest.getTopic(),
                    messageRequest.getMessageKey(),
                    messageRequest.getMessageTemplate(),
                    convertToKafkaHeaders(messageRequest.getHeaders())) ;
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            ResponseEntity.badRequest().body(e.getMessage());
        }
        return null;

    }

    public static List<Header> convertToKafkaHeaders(List<Map<String, String>> headersList) {
        List<Header> kafkaHeaders = new ArrayList<>();

        for (Map<String, String> headerMap : headersList) {
            String key = headerMap.get("key");
            String value = headerMap.get("value");

            // Create a new Kafka Header
            Header kafkaHeader = new RecordHeader(key, value.getBytes(StandardCharsets.UTF_8));

            // Add the Kafka Header to the list
            kafkaHeaders.add(kafkaHeader);
        }

        return kafkaHeaders;
    }

//    public static List<Header> convertToKafkaHeaders(List<Map<String, String>> headersList) {
//        List<Header> kafkaHeaders = new ArrayList<>();
//
//        for (Map<String, String> headerMap : headersList) {
//            for (Map.Entry<String, String> entry : headerMap.entrySet()) {
//                String key = entry.getKey();
//                String value = entry.getValue();
//
//                // Create a new Kafka Header
//                Header kafkaHeader = new RecordHeader(key, value.getBytes(StandardCharsets.UTF_8));
//
//                // Add the Kafka Header to the list
//                kafkaHeaders.add(kafkaHeader);
//            }
//        }
//
//        return kafkaHeaders;
//    }
}



