//package com.springrest.config;
//
//import com.mongodb.ConnectionString;
//import com.mongodb.MongoClientSettings;
//import com.mongodb.client.MongoClient;
//import com.mongodb.client.MongoClients;
//import com.springrest.mysql.model.DatabaseConnection;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class MongoConfig {
//
//    @Value("${mongodb.host}")
//    private String hostname;
//
//    @Value("${mongodb.database}")
//    private String db_name;
//
//    @Value("${mongodb.username}")
//    private String username;
//
//    @Value("${mongodb.password}")
//    private String password;
//
//    @Bean
//    public MongoClient mongoClient(DatabaseConnection databaseConnection) {
//        ConnectionString connectionString = new ConnectionString(getConnectionString(databaseConnection));
//        MongoClientSettings settings = MongoClientSettings.builder()
//                .applyConnectionString(connectionString)
//                .applyToSslSettings(sslBuilder -> sslBuilder.enabled(true))
//                .build();
//        return MongoClients.create(settings);
//    }
//
//    private String getConnectionString(DatabaseConnection databaseConnection) {
//        // Construct the connection string dynamically
//        return "mongodb+srv://" +
//                databaseConnection.getUsername() + ":" +
//                databaseConnection.getPassword() + "@" +
//                databaseConnection.getHostname() + "/" +
//                databaseConnection.getDb_name()
//                +"?retryWrites=true&w=majority";
//    }
//}
