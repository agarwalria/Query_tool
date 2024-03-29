package com.springrest.mysql.dao;

import com.springrest.mysql.model.DataType;
import com.springrest.mysql.model.Placeholder;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface PlaceholderRepository extends CrudRepository<Placeholder, Integer> {

    @Transactional
    @Modifying
    @Query("UPDATE Placeholder p SET p.name = :name, p.type = :type WHERE p.id = :id")
    void updatePlaceholder(@Param("id") int id, @Param("name") String name, @Param("type") DataType type);
}
