package ru.kata.spring.boot_security.demo.controllers;

import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.util.List;
import java.util.Set;

@Controller
@AllArgsConstructor
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;
    private final RoleService roleService;

    @GetMapping
    public String homepage(@AuthenticationPrincipal User user,
                           Role role,
                           Model model) {
        model.addAttribute("users", userService.getAll());
        model.addAttribute("user", user);
        model.addAttribute("new_user", new User());
        model.addAttribute("roles", roleService.getAll());
        model.addAttribute("role", role);
        return "index";
    }

    @GetMapping("/new")
    public String userCreationForm(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", roleService.getAll());
        return "redirect:/new";
    }

    @PostMapping("/new")
    public String createUser(@ModelAttribute User user,
                             @RequestParam List<Long> authorities) {
        Set<Role> selectedRoles = roleService.findAllByIdIn(authorities);
        user.setRoles(selectedRoles);
        userService.save(user);
        return "redirect:/admin";
    }

    @GetMapping("/edit/{id}")
    public String userEditForm(@PathVariable Long id,
                               Model model) {
        model.addAttribute("user", userService.findById(id));
        return "redirect:/{id}";
    }

    @PatchMapping("/{id}")
    public String updateUser(@ModelAttribute User user) {
        userService.save(user);
        return "redirect:/admin";
    }

    @GetMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return "redirect:/admin";
    }
}
