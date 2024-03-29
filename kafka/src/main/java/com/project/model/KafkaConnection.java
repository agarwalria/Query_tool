//package com.project.model;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "successful_connections")
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//public class KafkaConnection {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "bootstrap_servers")
//    private String bootstrapServers;
//
//    @Column(name = "topic")
//    private String topic;
//
//    @Column(name = "timestamp")
//    private LocalDateTime timestamp;
//}
//
