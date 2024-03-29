package com.project.service;

import com.project.Repository.KafkaTemplateRepository;
import com.project.model.KafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TemplateService {

    private final KafkaTemplateRepository templateRepository;

    @Autowired
    public TemplateService(KafkaTemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    public List<KafkaTemplate> getAllTemplates() {
        return templateRepository.findAll();
    }

    public Optional<KafkaTemplate> getTemplateById(Long id) {
        return templateRepository.findById(id);
    }

    public KafkaTemplate createTemplate(KafkaTemplate kafkaTemplate) {
        // Additional logic if needed before saving
        return templateRepository.save(kafkaTemplate);
    }

    public KafkaTemplate updateTemplate(Long id, KafkaTemplate updatedKafkaTemplate) {
        if (templateRepository.existsById(id)) {
            updatedKafkaTemplate.setId(id);
            return templateRepository.save(updatedKafkaTemplate);
        }
        return null; // Handle not found case
    }

    public void deleteTemplate(Long id) {
        templateRepository.deleteById(id);
    }
}


