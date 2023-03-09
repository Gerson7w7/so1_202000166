USE dbpractica2;
CREATE TABLE cpu (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cpu_usage DOUBLE,
  running_processes INT,
  sleeping_processes INT,
  stopped_processes INT,
  zombie_processes INT,
  total_processes INT
);
CREATE TABLE proceso (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pid INT,
  _name VARCHAR(255),
  _uid INT,
  ram_usada DOUBLE,
  estado VARCHAR(20),
  cpu_id INT,
  FOREIGN KEY (cpu_id) REFERENCES cpu(id)
);
CREATE TABLE subproceso (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pid INT,
  nombre VARCHAR(255),
  proceso_id INT,
  FOREIGN KEY (proceso_id) REFERENCES proceso(id)
);
CREATE TABLE ram (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ram_usada DOUBLE
);