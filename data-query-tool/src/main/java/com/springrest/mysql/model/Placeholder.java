package com.springrest.mysql.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

import jakarta.persistence.*;

@Entity
@Table(name = "placeholders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Placeholder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "query_id", nullable = false)
    @JsonBackReference
    private QueryDetails queryDetails;

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DataType type;

}

