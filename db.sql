CREATE DATABASE recipe_app ;

CREATE TABLE recipies(
  id SERIAL PRIMARY KEY,
  name CHARACTER(255),
  ingredients TEXT,
  directions TEXT
);
