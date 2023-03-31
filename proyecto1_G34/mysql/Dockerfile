FROM mysql:latest

ENV MYSQL_DATABASE=dbproyecto1 \
    MYSQL_ROOT_PASSWORD=password

# Copia el archivo SQL a la carpeta /docker-entrypoint-initdb.d/
COPY ./database.sql /docker-entrypoint-initdb.d/

# Expone el puerto MySQL
EXPOSE 3306

# Agrega un volumen para almacenar datos de MySQL persistentes
VOLUME /var/lib/mysql

# Inicializa la base de datos y el usuario root, y ejecuta el archivo SQL
CMD ["mysqld", "--init-file=/docker-entrypoint-initdb.d/database.sql"]

# para correr el contenedor: docker run -v $(pwd)/db_data:/var/lib/mysql nombre_de_la_imagen