FROM node:alpine

#Directorio de trabajo
WORKDIR /app

# Copia archivos de librerías
COPY package.json /app
COPY package-lock.json /app

# Instala dependencias
RUN npm install

# Copia archivos
COPY /proto/ ./proto
COPY server.js .
COPY conn.js .

EXPOSE 50051

CMD ["node", "server.js"]

# Para correr el contenedor: docker run -d -p 50051:50051 nombre_de_la_imagen