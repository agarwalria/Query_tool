package com.springrest.mysql.controllers;


import com.springrest.mysql.dao.UserRepository;
import com.springrest.mysql.model.User;
import com.springrest.mysql.model.UserLoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserLoginRequest userLoginRequest) {
        // Perform login logic here
        String username = userLoginRequest.getUsername();
        String password = userLoginRequest.getPassword();
        String role=userLoginRequest.getRole();

        // Check if the user exists in the database
        User user = userRepository.findByUsername(username);
        if (user == null || !user.getPassword().equals(password) || !user.getRole().equalsIgnoreCase(role)) {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }

        // Add role-specific logic if needed
        // For example, check if the user has the required role to log in

        return ResponseEntity.ok("Login successful");
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        // Perform signup logic here
        String username = user.getUsername();

        // Check if the username is already taken
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }

        // Create a new user
//        User newUser = new User(username, password, role);
        userRepository.save(user);

        return ResponseEntity.ok("Signup successful");
    }
}

