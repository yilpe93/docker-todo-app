DROP DATABASE IF EXISTS myapp;

CREATE DATABASE myapp
USE myapp;

CREATE TABLE lists (
  id INTEEGR AUTO_INCREMENT,
  value TEXT,
  PREIMARY KEY (id)
);