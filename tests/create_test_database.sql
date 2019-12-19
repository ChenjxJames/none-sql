CREATE DATABASE `none-sql`;
USE `none-sql`;
CREATE TABLE `none-sql`.`user` (
    `username` VARCHAR(64) PRIMARY KEY, 
    `password` VARCHAR(64) NOT NULL 
) ENGINE = InnoDB;