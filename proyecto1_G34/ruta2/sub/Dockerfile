FROM golang:1.20-alpine

ENV GOPROXY=https://proxy.golang.org

#Directorio de trabajo
WORKDIR /

# Copia archivos
COPY . .

# Instala dependencias
RUN go mod download

CMD ["go", "run", "/main.go"]

# Para correr el contenedor: docker run -d nombre_de_la_imagen