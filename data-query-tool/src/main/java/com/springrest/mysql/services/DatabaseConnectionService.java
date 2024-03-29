package com.springrest.mysql.services;

import com.springrest.mysql.model.DatabaseConnection;

import java.util.List;
import java.util.Optional;

public interface DatabaseConnectionService {
    public List<DatabaseConnection> getAllConnections();
    public Optional<DatabaseConnection> getConnectionById(int id);
    public DatabaseConnection addConnection(DatabaseConnection databaseConnection);
    public void deleteConnection(int id);
}
