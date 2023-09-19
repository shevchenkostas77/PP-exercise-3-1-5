package ru.kata.spring.boot_security.demo.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.RoleDao;
import ru.kata.spring.boot_security.demo.models.Role;

import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class RoleServiceImpl implements RoleService {
    private final RoleDao roleDao;

    @Override
    public Set<Role> findAllByIdIn(List<Long> roleIds) {
        return roleDao.findAllByIdIn(roleIds);
    }

    @Override
    public List<Role> getAll() {
        return roleDao.findAll();
    }
}

