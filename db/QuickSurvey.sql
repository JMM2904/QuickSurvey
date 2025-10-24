CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE encuestas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  creador_id INT NOT NULL,
  color VARCHAR(7),
  imagen TEXT,
  FOREIGN KEY (creador_id) REFERENCES usuarios(id)
);

CREATE TABLE opciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  encuesta_id INT NOT NULL,
  texto VARCHAR(255) NOT NULL,
  FOREIGN KEY (encuesta_id) REFERENCES encuestas(id)
);

CREATE TABLE votos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  encuesta_id INT NOT NULL,
  opcion_id INT NOT NULL,
  usuario_id INT,
  FOREIGN KEY (encuesta_id) REFERENCES encuestas(id),
  FOREIGN KEY (opcion_id) REFERENCES opciones(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
