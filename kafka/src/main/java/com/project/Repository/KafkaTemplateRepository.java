package com.project.Repository;

import com.project.model.KafkaTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KafkaTemplateRepository extends JpaRepository<KafkaTemplate, Long> {
    KafkaTemplate findByTopic(String topic);

}
