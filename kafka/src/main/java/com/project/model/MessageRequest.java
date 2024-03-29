package com.project.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.kafka.common.header.Header;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {
    private String bootstrapServers;
    private String topic;
    private String messageTemplate;
    private String messageKey;
    private List<Map<String, String>> headers;

}
