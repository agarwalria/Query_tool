package com.project.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.kafka.common.header.Header;

import java.util.List;

@Entity
@Table(name = "kafka_templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KafkaTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bootstrap_servers")
    private String bootstrapServers;

    @Column(name = "topic")
    private String topic;

//    @Column(name="headers")
//    private List<Header> headers;

//    @Column(name = "key")
//    private String key;

    @Column(name = "message_template")
    private String messageTemplate;

//    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, orphanRemoval = true)
//    @JsonManagedReference
//    private List<Placeholder> placeholders;

}