# version ubuntu
FROM ubuntu:20.04

# instalamos jq
RUN apt-get update && apt-get install -y jq
RUN apt-get update && apt-get install -y curl

# creación del directorio de trabajo
WORKDIR /app

# copiamos mi script en el directorio app
COPY reportes.sh ./

# ejecutamos el script
RUN chmod 750 reportes.sh
CMD ["./reportes.sh"]