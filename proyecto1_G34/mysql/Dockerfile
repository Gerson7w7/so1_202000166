FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=dbproyecto1

# Copia el archivo SQL a la carpeta /docker-entrypoint-initdb.d/
COPY ./database.sql /docker-entrypoint-initdb.d/

# Expone el puerto MySQL
EXPOSE 3306

# para correr el contenedor: sudo docker run -p 3306:3306 -v $pwd/db_data:/var/lib/mysql gerson7w7/dbproyecto