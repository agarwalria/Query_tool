package com.springrest.mysql.model;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class QueryBody {
    private String query;
    private String collectionName;

}
