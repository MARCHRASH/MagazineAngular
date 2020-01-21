CREATE DATABASE lacitproject;

CREATE TABLE users
(
	id serial PRIMARY KEY NOT NULL,
	login CHARACTER VARYING(30),
	password CHARACTER VARYING(50),
	role CHARACTER VARYING(20)
);

CREATE TABLE products
(
	id serial PRIMARY KEY NOT NULL,
	name CHARACTER VARYING(50),
	price NUMERIC,
	counter INTEGER
);

CREATE TABLE orders
(
	id serial PRIMARY KEY,
	userId INTEGER NOT NULL REFERENCES users(id),
	productId INTEGER NOT NULL REFERENCES products(id),
	counter INTEGER DEFAULT 1
);

INSERT INTO products(name, price, counter)
VALUES 
('рыба',20,10),
('свинина',50,5),
('йогурт',10,20),
('сыр',25,15),
('молоко',5,100);

INSERT INTO users(login,password,role)
VALUES
('admin','admin','admin'),
('custOne','1111','user'),
('custTwo','222','user');

INSERT INTO orders(userId,productId,counter)
VALUES
(
	(SELECT id FROM users WHERE login = 'custOne'),
	(SELECT id FROM products WHERE name = 'рыба'),
	2
),
(
	(SELECT id FROM users WHERE login = 'custTwo'),
	(SELECT id FROM products WHERE name = 'йогурт'),
	1
),
(
	(SELECT id FROM users WHERE login = 'custOne'),
	(SELECT id FROM products WHERE name = 'молоко'),
	3
);