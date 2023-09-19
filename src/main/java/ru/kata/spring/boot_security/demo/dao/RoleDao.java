package ru.kata.spring.boot_security.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kata.spring.boot_security.demo.models.Role;

import java.util.List;
import java.util.Set;

public interface RoleDao extends JpaRepository<Role, Long> {
    Set<Role> findAllByIdIn(List<Long> roleIds);
}
