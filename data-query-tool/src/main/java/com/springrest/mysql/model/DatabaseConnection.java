package com.springrest.mysql.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "database_connections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DatabaseConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String hostname;

    @Column(nullable = false)
    private String port;

    @Column(nullable = false)
    private String db_name;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "databaseConnection",cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<QueryDetails> sqlQueries;


}

