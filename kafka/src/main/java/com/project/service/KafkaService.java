package com.project.service;

import com.project.Repository.KafkaTemplateRepository;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.Header;
import org.apache.kafka.common.header.internals.RecordHeader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Properties;


@Service
public class KafkaService {
    @Autowired
    private KafkaTemplateRepository kafkaConnectionRepository;

    Producer<String,String> producer;


    public String postMessageToKafka(String bootstrapServers, String topic,String key, String messageTemplate,List<Header> headers) {
        Properties properties = new Properties();
        properties.put("bootstrap.servers", bootstrapServers);
        properties.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        properties.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        producer=new KafkaProducer<>(properties);
        // Attempt to connect to Kafka
        try  {
//            List<Header> headers = Arrays.asList(
//                    new RecordHeader("headerKey1", "headerValue1".getBytes()),
//                    new RecordHeader("headerKey2", "headerValue2".getBytes())
//            );
            ProducerRecord<String, String> record = new ProducerRecord<>(topic,null,key,messageTemplate,headers);
            producer.send(record);
            return "Sent success";

//            // Store the successful connection details
//            KafkaConnection kafkaConnection = new KafkaConnection();
//            kafkaConnection.setBootstrapServers(bootstrapServers);
//            kafkaConnection.setTopic(topic);
//            kafkaConnection.setTimestamp(LocalDateTime.now());
//            kafkaConnectionRepository.save(kafkaConnection);

            // Retrieve the template based on the topic
//            KafkaTemplate kafkaTemplate = templateRepository.findByTopic(topic);
//            if (kafkaTemplate != null) {
//                // Use the template for further processing
//                System.out.println("Found template: " + kafkaTemplate.getMessageTemplate());
//            } else {
//                System.out.println("No template found for the topic: " + topic);
//            }
        } catch (Exception e) {
            return "Failure";
            //e.printStackTrace(); // Handle connection failure
        }finally {
            producer.close();
        }
    }
}

