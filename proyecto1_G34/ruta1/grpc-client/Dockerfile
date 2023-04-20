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
COPY client.js .

EXPOSE 4000

CMD ["node", "client.js"]

# Para correr el contenedor: docker run -d -p 4000:4000 nombre_de_la_imagen