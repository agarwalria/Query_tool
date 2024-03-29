//package com.springrest.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.jdbc.datasource.DriverManagerDataSource;
//
//import javax.sql.DataSource;
//
//@Configuration
//public class MySqlConfig {
//    @Bean
//    public DataSource dataSource() {
//        return new DriverManagerDataSource();
//    }
//
//    public void configureDataSource(DataSource dataSource, String hostname, String port, String database, String username, String password) {
//        if (dataSource instanceof DriverManagerDataSource) {
//            DriverManagerDataSource customDataSource = (DriverManagerDataSource) dataSource;
//            customDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
//            customDataSource.setUrl("jdbc:mysql://" + hostname + ":" + port + "/" + database);
//            customDataSource.setUsername(username);
//            customDataSource.setPassword(password);
//
//// Set Hibernate dialect
//            ((DriverManagerDataSource) dataSource).setUrl(customDataSource.getUrl());
//            ((DriverManagerDataSource) dataSource).setUsername(customDataSource.getUsername());
//            ((DriverManagerDataSource) dataSource).setPassword(customDataSource.getPassword());
//            ((DriverManagerDataSource) dataSource).setDriverClassName("com.mysql.cj.jdbc.Driver");
//
//
//            System.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
//        } else {
//            throw new IllegalArgumentException("Unsupported DataSource type: " + dataSource.getClass().getName());
//        }
//    }
//}
//
//
