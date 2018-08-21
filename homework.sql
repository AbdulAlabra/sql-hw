DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    id int NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(6,2) NOT NULL,
stock_quantity INT,
    PRIMARY KEY (id)
);