package com.springrest.mysql.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.util.List;

@Entity
@Table(name = "query_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QueryDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String query;

    @ManyToOne
    @JoinColumn(name = "database_connection_id", nullable = false)
    @JsonBackReference
    private DatabaseConnection databaseConnection;

    @OneToMany(mappedBy = "queryDetails", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Placeholder> placeholders;

    //to store the MongoDB collection name
    @Column(nullable = true)
    private String mongoCollection;

//    @Column
//    @Value("mysql")
//    private String queryType;
//
//    @PrePersist
//    public void prePersist() {
//        // Logic to be executed before the entity is persisted
//        if (databaseConnection != null) {
//            this.queryType = databaseConnection.getType();
//        }
//        else{
//            this.queryType="mysql";
//        }
//    }

}



