# golang version
FROM golang:1.16-alpine

# creación del directorio de trabajo
WORKDIR /app

# copiando archivos con las librerías necesrias
COPY go.mod ./
COPY go.sum ./

# comando para instalar dependencias 
RUN go mod download

COPY *.go ./

RUN go build -o /docker-gs-ping

EXPOSE 4000

CMD [ "/docker-gs-ping" ]

# luego creamos la imagen con el siguiente comando:
# docker build -t gerson7w7/backend_practica2_202000166 .
# en el directorio que este el dockerfile