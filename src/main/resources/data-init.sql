INSERT INTO users (first_name, last_name, age, email, password)
VALUES ('admin', 'admin', 35, 'admin@mail.ru', '{noop}admin'),
       ('user', 'user', 30, 'user@mail.ru', '{noop}user');

INSERT INTO roles (name)
VALUES ('ADMIN'),
       ('USER');

INSERT INTO users_roles (user_id, role_id)
VALUES (1, 1),
       (1, 2),
       (2, 2);