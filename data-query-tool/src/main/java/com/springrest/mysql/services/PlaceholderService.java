package com.springrest.mysql.services;

import com.springrest.mysql.dao.PlaceholderRepository;
import com.springrest.mysql.model.DataType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlaceholderService {

    private final PlaceholderRepository placeholderRepository;

    @Autowired
    public PlaceholderService(PlaceholderRepository placeholderRepository) {
        this.placeholderRepository = placeholderRepository;
    }

    public void updatePlaceholder(int id, String name, DataType type) {
        placeholderRepository.updatePlaceholder(id, name, type);
    }
}

