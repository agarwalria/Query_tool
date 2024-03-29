package com.springrest.mysql.services;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.springrest.mysql.model.DatabaseConnection;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MongoConnectionService {

    public MongoDatabase connectToDatabase(DatabaseConnection databaseConnection){
        try{
            String mongoUri = "mongodb+srv://" +
                    databaseConnection.getUsername() + ":" +
                    databaseConnection.getPassword() + "@" +
                    databaseConnection.getHostname() + "/" +
                    databaseConnection.getDb_name()
                    +"?retryWrites=true&w=majority";
            MongoClientSettings settings = MongoClientSettings.builder()
                    .applyConnectionString(new ConnectionString(mongoUri))
                    .applyToSslSettings(sslBuilder -> sslBuilder.enabled(true))
                    .build();

            com.mongodb.client.MongoClient mongoClient = MongoClients.create(settings);
            MongoDatabase mongoDatabase = mongoClient.getDatabase(databaseConnection.getDb_name());
            return mongoDatabase;

//            String collectionName = "books";
//            // Perform MongoDB operations using mongoDatabase as needed
//            mongoDatabase.getCollection(collectionName).find().forEach(document -> {
//                // Process each document
//                System.out.println(document.toJson());
//            });
//
//            // Close the MongoDB client when done
//            mongoClient.close();

        }catch(Exception e){
            e.printStackTrace();
            return null;
        }

    }
    public List<Document> executeDynamicQuery(MongoDatabase mongoDatabase, String collectionName, String dynamicQuery) {
        List<Document> results = new ArrayList<>();

        try {
            MongoCollection<Document> collection = mongoDatabase.getCollection(collectionName);

            // Execute the dynamic query using the provided string
            if(dynamicQuery!=null){
                collection.find(Document.parse(dynamicQuery)).forEach(results::add);
            }
            else{
                collection.find().forEach(results::add);
            }


        } catch (Exception e) {
            e.printStackTrace();
            // Handle the exception as needed
        }

        return results;
    }
}
