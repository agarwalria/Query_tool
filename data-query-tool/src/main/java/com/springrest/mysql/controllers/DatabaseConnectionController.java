package com.springrest.mysql.controllers;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import com.springrest.mysql.model.DatabaseConnection;
import com.springrest.mysql.model.QueryBody;
import com.springrest.mysql.services.DatabaseConnectionService;
import com.springrest.mysql.services.MongoConnectionService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.web.bind.annotation.*;

//import javax.sql.DataSource;
//import java.sql.Connection;
//import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/db_connection")
@CrossOrigin(origins = "http://localhost:3000")
public class DatabaseConnectionController {

    @Autowired
    private DatabaseConnectionService databaseConnectionService;

    @Autowired
    private MongoConnectionService mongoConnectionService;

    private MongoDatabase mongoDatabase;

    @Value("${spring.datasource.url}")
    private String defaultUrl;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public List<DatabaseConnection> getAllConnections() {
        return databaseConnectionService.getAllConnections();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DatabaseConnection> getConnectionById(@PathVariable int id) {
        try {
            DatabaseConnection databaseConnection = databaseConnectionService.getConnectionById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Connection not found with id " + id));
            return ResponseEntity.ok(databaseConnection);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<DatabaseConnection> addConnection(@RequestBody @Valid DatabaseConnection databaseConnection){
        DatabaseConnection saveConnection = databaseConnectionService.addConnection(databaseConnection);
        return ResponseEntity.ok(saveConnection);
    }

    @PostMapping("/connect")
    public ResponseEntity<?> connectToDatabase(@RequestBody @Valid DatabaseConnection databaseConnection) {
        try{
            if("MySql".equalsIgnoreCase(databaseConnection.getType())){
                DriverManagerDataSource customDataSource = new DriverManagerDataSource();
                customDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
                customDataSource.setUrl("jdbc:mysql://" + databaseConnection.getHostname() +
                        ":" + databaseConnection.getPort() +
                        "/" + databaseConnection.getDb_name());
                customDataSource.setUsername(databaseConnection.getUsername());
                customDataSource.setPassword(databaseConnection.getPassword());

                jdbcTemplate.setDataSource(customDataSource);
            }
            else if ("MongoDB".equalsIgnoreCase(databaseConnection.getType())) {
                mongoDatabase = mongoConnectionService.connectToDatabase(databaseConnection);

               // Execute query
                String collectionName="books";
                mongoDatabase.getCollection(collectionName).find().forEach(document -> {
                    System.out.println(document.toJson());
                });
            } else {
                return ResponseEntity.badRequest().body("Invalid database type. Must be either MySql or MongoDB.");
            }
            return ResponseEntity.status(200).body(databaseConnection);
        }catch(Exception e){
            return ResponseEntity.badRequest().body("Error establishing connection: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void deleteConnection(@PathVariable int id) {
        databaseConnectionService.deleteConnection(id);
    }


    @PostMapping("/mongo/query")
    public ResponseEntity<?> executeMongoQuery(@RequestBody QueryBody queryBody) {
        try {
            if (mongoDatabase != null) {
                String query = queryBody.getQuery();
                String collectionName = queryBody.getCollectionName();

                if (collectionName == null || collectionName.isEmpty()) {
                    return ResponseEntity.badRequest().body("Collection name is required.");
                }

                List<Document> results = mongoConnectionService.executeDynamicQuery(
                        mongoDatabase,
                        collectionName,
                        query
                );

                // Process the query results

                for (Document document : results) {
                    System.out.println(document.toJson());
                }

                return ResponseEntity.ok(results);
            } else {
                return ResponseEntity.badRequest().body("MongoDB connection is not established.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error executing MongoDB query: " + e.getMessage());
        }
    }
}



