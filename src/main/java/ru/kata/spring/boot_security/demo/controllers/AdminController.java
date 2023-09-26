package ru.kata.spring.boot_security.demo.controllers;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final UserService userService;
    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<List<User>> allUsers() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(userService.getAll());
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> allRoles() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(roleService.getAll());
    }

    @GetMapping("/current_user")
    public ResponseEntity<User> currentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(userService.findByEmail(user.getEmail()));
    }

    @PostMapping
    public ResponseEntity<HttpStatus> createUser(@RequestBody User user) {
        userService.save(user);
        return ResponseEntity.ok(HttpStatus.CREATED);
    }

    @PatchMapping
    public ResponseEntity<HttpStatus> updateUser(@RequestBody User user) {
        userService.save(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }
}
