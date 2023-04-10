USE dbproyecto1;

CREATE TABLE voto (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sede INT NOT NULL,
  municipio VARCHAR(50) NOT NULL,
  departamento VARCHAR(50) NOT NULL,
  papeleta VARCHAR(25) NOT NULL,
  partido VARCHAR(25) NOT NULL
);