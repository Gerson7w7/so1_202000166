USE dbproyecto1;

CREATE TABLE voto (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sede int,
  municipio VARCHAR(25),
  departamento VARCHAR(25),
  papeleta VARCHAR(25),
  partido VARCHAR(25)
);