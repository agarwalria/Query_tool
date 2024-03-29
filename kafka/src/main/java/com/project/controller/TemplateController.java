package com.project.controller;

import com.project.model.KafkaTemplate;
//import com.project.service.TemplateService;
import com.project.service.TemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/templates")
@CrossOrigin(origins = "*")
public class TemplateController {

    private final TemplateService templateService;

    @Autowired
    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @GetMapping
    public List<KafkaTemplate> getAllTemplates() {
        return templateService.getAllTemplates();
    }

    @GetMapping("/{id}")
    public ResponseEntity<KafkaTemplate> getTemplateById(@PathVariable Long id) {
        Optional<KafkaTemplate> template = templateService.getTemplateById(id);
        return template.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<KafkaTemplate> createTemplate(@RequestBody KafkaTemplate kafkaTemplate) {
        KafkaTemplate createdKafkaTemplate = templateService.createTemplate(kafkaTemplate);
        return ResponseEntity.ok(createdKafkaTemplate);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KafkaTemplate> updateTemplate(@PathVariable Long id, @RequestBody KafkaTemplate updatedKafkaTemplate) {
        KafkaTemplate kafkaTemplate = templateService.updateTemplate(id, updatedKafkaTemplate);
        return kafkaTemplate != null ? ResponseEntity.ok(kafkaTemplate) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }
}



