package com.springrest.mysql.controllers;

import com.springrest.mysql.model.DataType;
import com.springrest.mysql.model.Placeholder;
import com.springrest.mysql.model.QueryDetails;
import com.springrest.mysql.services.PlaceholderService;
import com.springrest.mysql.services.QueryDetailsService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sql-queries")
@CrossOrigin(origins = "http://localhost:3000")
public class QueryDetailsController {

    @Autowired
    private QueryDetailsService queryDetailsService;

    @Autowired
    private PlaceholderService placeholderService;

    @GetMapping
    public ResponseEntity<List<QueryDetails>> getAllSqlQuery() {
        List<QueryDetails> queryDetails = queryDetailsService.getAllQueryDetails();
        return ResponseEntity.ok(queryDetails);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QueryDetails> getSqlQueryById(@PathVariable int id) {
        try{
            QueryDetails queryDetails = queryDetailsService.getQueryDetailsById(id)
                    .orElseThrow(() -> new EntityNotFoundException("SqlQuery not found with id"+id));
            return ResponseEntity.ok(queryDetails);

        }catch (EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/by-database-connection")
    public ResponseEntity<?> getSqlQueryByDatabaseConnectionId(@RequestParam int databaseConnectionId) {
        try {
            List<QueryDetails> result = queryDetailsService.getQueryDetailsByDatabaseConnectionId(databaseConnectionId);
            return ResponseEntity.ok(result);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid databaseConnectionId format");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<QueryDetails> createSqlQuery(@RequestBody @Valid QueryDetails queryDetails) {
        QueryDetails createdQuery = queryDetailsService.addQueryDetails(queryDetails);
        return ResponseEntity.ok(createdQuery);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSqlQuery(@PathVariable int id) {
        queryDetailsService.deleteQueryDetails(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<QueryDetails> updateSqlQuery(@PathVariable int id, @RequestBody @Valid QueryDetails updatedQuery) {
        try {
            QueryDetails existingQuery = queryDetailsService.getQueryDetailsById(id)
                    .orElseThrow(() -> new EntityNotFoundException("SqlQuery not found with id " + id));

            // Update the fields with the new values
            existingQuery.setTitle(updatedQuery.getTitle());
            existingQuery.setDescription(updatedQuery.getDescription());
            existingQuery.setQuery(updatedQuery.getQuery());
            existingQuery.setMongoCollection(updatedQuery.getMongoCollection());

            //update Placeholder
            List<Placeholder> updatedPlaceholders=updatedQuery.getPlaceholders();
            for(Placeholder updatedPlaceholder:updatedPlaceholders){
                int placeholderId= updatedPlaceholder.getId();
                String placeholderName=updatedPlaceholder.getName();
                DataType placeholderType=updatedPlaceholder.getType();
                placeholderService.updatePlaceholder(placeholderId,placeholderName,placeholderType);

            }

            // Save the updated query
            QueryDetails updatedQueryResult = queryDetailsService.addQueryDetails(existingQuery);

            return ResponseEntity.ok(updatedQueryResult);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}

