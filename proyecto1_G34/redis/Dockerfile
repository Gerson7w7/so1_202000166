FROM redis:latest

#Directorio de trabajo
WORKDIR /usr/src/app

# Copia el archivo de configuración de Redis
COPY redis.conf /usr/local/etc/redis/redis.conf

# Expone el puerto de Redis
EXPOSE 6379

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]

# Para correr el contenedor: docker run -d -p 6379:6379 nombre_de_la_imagen