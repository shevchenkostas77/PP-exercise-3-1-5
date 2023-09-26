package ru.kata.spring.boot_security.demo.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.UserRepository;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
    private final UserRepository userDao;
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
            user.getRoles().forEach(role -> {
                log.debug("Loading role: {}", role.getName());
            });
        }
        return users;
    }

    @Override
    public User findByEmail(String email) throws UsernameNotFoundException {
        User user = userDao.findByEmail(email).orElseThrow(() ->
                new UsernameNotFoundException("User not found with email: " + email));

        user.getRoles().forEach(role -> {
            log.debug("Loading role: {}", role.getName());
        });
        return user;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return findByEmail(email);
    }
}
