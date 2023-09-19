package ru.kata.spring.boot_security.demo.services;

import lombok.AllArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.UserDao;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public User save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userDao.save(user);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        userDao.delete(findById(id));
    }

    @Override
    public User findById(Long id) throws UsernameNotFoundException {
        return userDao.findById(id).orElseThrow(() ->
                new UsernameNotFoundException("User not found with id: " + id));
    }

    @Override
    public List<User> getAll() {
        List<User> users = userDao.findAll();
        for (User user : users) {
            Hibernate.initialize(user.getRoles());
        }
        return users;
    }

    @Override
    public User findByEmail(String email) throws UsernameNotFoundException {
        return userDao.findByEmail(email).orElseThrow(() ->
                new UsernameNotFoundException("User not found with email: " + email));
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userDao.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        return user;
    }
}
