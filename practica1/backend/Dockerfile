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

EXPOSE 5000

CMD [ "/docker-gs-ping" ]