package com.springrest.mysql.services;


import com.springrest.mysql.model.QueryDetails;

import java.util.List;
import java.util.Optional;

public interface QueryDetailsService {
    public List<QueryDetails> getAllQueryDetails();
    public Optional<QueryDetails> getQueryDetailsById(int id);
    public List<QueryDetails> getQueryDetailsByDatabaseConnectionId(int databaseConnectionId);
    public QueryDetails addQueryDetails(QueryDetails queryDetails);
    public void deleteQueryDetails(int id);

}
