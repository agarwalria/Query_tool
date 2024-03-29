package com.springrest.mysql.services;

import com.springrest.mysql.dao.DatabaseConnectionRepository;
import com.springrest.mysql.model.DatabaseConnection;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DatabaseConnectionServiceImpl implements DatabaseConnectionService {
    @Autowired
    private DatabaseConnectionRepository databaseConnectionRepository;
//    @Autowired
//    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public List<DatabaseConnection> getAllConnections() {
        return databaseConnectionRepository.findAll();
    }

    @Override
    public Optional<DatabaseConnection> getConnectionById(int id) {
        return databaseConnectionRepository.findById(id);
    }

    @Override
    public DatabaseConnection addConnection(DatabaseConnection databaseConnection) {
        //databaseConnection.setPassword(bCryptPasswordEncoder.encode(databaseConnection.getPassword()));
        return databaseConnectionRepository.save(databaseConnection);
    }

    @Override
    public void deleteConnection(int id) {
        databaseConnectionRepository.deleteById(id);
    }
}
