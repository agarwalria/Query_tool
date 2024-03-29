package com.springrest.mysql.dao;

import com.springrest.mysql.model.QueryDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QueryDetailsRepository extends JpaRepository<QueryDetails,Integer> {
    List<QueryDetails> findByDatabaseConnectionId(int databaseConnectionId);

}