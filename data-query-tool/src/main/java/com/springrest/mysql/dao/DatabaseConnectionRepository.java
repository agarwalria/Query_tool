package com.springrest.mysql.dao;

import com.springrest.mysql.model.DatabaseConnection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DatabaseConnectionRepository extends JpaRepository<DatabaseConnection,Integer> {

}
