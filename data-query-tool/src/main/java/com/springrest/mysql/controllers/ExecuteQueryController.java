package com.springrest.mysql.controllers;

import com.springrest.mysql.dao.ResultSetMapper;
import com.springrest.mysql.model.QueryBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class ExecuteQueryController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("execute-query")
    public ResponseEntity<?> executeQuery(@RequestBody QueryBody query) {
        String encodedQuery = query.getQuery();
        String sql=java.net.URLDecoder.decode(encodedQuery, StandardCharsets.UTF_8);
        try {
            if(isSelectQuery(sql)){
                List<Map<String, Object>> result = jdbcTemplate.query(sql, new ResultSetMapper());
                return ResponseEntity.ok(result);
            }
            else if(isUpdateQuery(sql)){
                int updatedRows = jdbcTemplate.update(sql);
                Map<String, Object> updateResponse = new HashMap<>();
                updateResponse.put("updatedRows", updatedRows);
                return ResponseEntity.ok(updateResponse);
            }
            else if (isCreateQuery(sql)) {
                jdbcTemplate.execute(sql);
                Map<String, Object> createTableResponse = new HashMap<>();
                createTableResponse.put("message", "Table created successfully");
                return ResponseEntity.ok(createTableResponse);
            }
            else if (isInsertQuery(sql)) {
                int insertedRows = jdbcTemplate.update(sql);
                Map<String, Object> insertResponse = new HashMap<>();
                insertResponse.put("insertedRows", insertedRows);
                return ResponseEntity.ok(insertResponse);
            }
            else if (isDeleteQuery(sql)) {
                int deletedRows = jdbcTemplate.update(sql);
                Map<String, Object> deleteResponse = new HashMap<>();
                deleteResponse.put("deletedRows", deletedRows);
                return ResponseEntity.ok(deleteResponse);
            }
            else{
                    // Handle unsupported queries
                    return ResponseEntity.badRequest().body("Unsupported query type");
            }

        } catch (Exception e) {
            // Handle errors gracefully
            return ResponseEntity.badRequest().body("Error:"+e.getMessage());
//            throw new RuntimeException("Error executing query: " + e.getMessage());
        }
    }

    private boolean isSelectQuery(String sql){
        //to check whether it is a select query or not
        return sql.trim().toLowerCase().startsWith("select");
    }
    private boolean isUpdateQuery(String sql){
        //to check whether it is a select query or not
        return sql.trim().toLowerCase().startsWith("update");
    }

    private boolean isCreateQuery(String sql){
        //to check whether it is a select query or not
        return sql.trim().toLowerCase().startsWith("create");
    }
    private boolean isInsertQuery(String sql) {
        return sql.startsWith("insert");
    }
    private boolean isDeleteQuery(String sql) {
        return sql.startsWith("delete");
    }
}
