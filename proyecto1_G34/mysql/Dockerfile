FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=dbproyecto1

# Copia el archivo SQL a la carpeta /docker-entrypoint-initdb.d/
COPY ./database.sql /docker-entrypoint-initdb.d/

# Expone el puerto MySQL
EXPOSE 3306

# Agrega un volumen para almacenar datos de MySQL persistentes
VOLUME /var/lib/mysql

# para correr el contenedor: docker run -d -p 3306:3306 -v $pwd/db_data:/var/lib/mysql nombre_de_la_imagen