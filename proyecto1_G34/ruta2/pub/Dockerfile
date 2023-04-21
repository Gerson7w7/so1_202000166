FROM golang:1.20-alpine

ENV GOPROXY=https://proxy.golang.org

#Directorio de trabajo
WORKDIR /

# Copia archivos
COPY . .

# Instala dependencias
RUN go mod download

EXPOSE 4100

CMD ["go", "run", "/main.go"]

# Para correr el contenedor: docker run -d -p 1500:1500 nombre_de_la_imagen