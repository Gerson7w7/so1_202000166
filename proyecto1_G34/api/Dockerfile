# versión de node
FROM node:18

# creación del directorio de trabajo
WORKDIR /app

# copiando archivos con las librerías necesrias
COPY package.json ./
COPY package-lock.json ./

# comando para instalar dependencias 
RUN npm install

# copiar las dependencias y archivos
COPY . .

# puerto a exponer
EXPOSE 5000

CMD [ "node", "api.js" ]

# luego creamos la imagen con el siguiente comando:
# docker build -t gerson7w7/api_proyecto1_202000166 .
# en el directorio que este el dockerfile