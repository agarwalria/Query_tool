package com.springrest.mysql.services;

//import com.springrest.dao.PlaceholderRepository;
import com.springrest.mysql.dao.QueryDetailsRepository;
import com.springrest.mysql.model.QueryDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QueryDetailsServiceImpl implements QueryDetailsService {
    @Autowired
    private QueryDetailsRepository queryDetailsRepository;

    //@Autowired
//    private PlaceholderRepository placeholderRepository;

    @Override
    public List<QueryDetails> getAllQueryDetails() {
        return queryDetailsRepository.findAll();
    }

    @Override
    public Optional<QueryDetails> getQueryDetailsById(int id) {
        return queryDetailsRepository.findById(id);
    }

    @Override
    public List<QueryDetails> getQueryDetailsByDatabaseConnectionId(int databaseConnectionId){
        return queryDetailsRepository.findByDatabaseConnectionId(databaseConnectionId);
    }

    @Override
    public QueryDetails addQueryDetails(QueryDetails queryDetails) {

        QueryDetails savedQuery = queryDetailsRepository.save(queryDetails);
//        if (sqlQuery.getPlaceholders() != null) {
//            for (Placeholder placeholder : sqlQuery.getPlaceholders()) {
//                placeholder.setSqlQuery(savedQuery);
//                placeholderRepository.save(placeholder);
//            }
//        }
        return savedQuery;
    }

    @Override
    public void deleteQueryDetails(int id) {
        queryDetailsRepository.deleteById(id);
    }
}
