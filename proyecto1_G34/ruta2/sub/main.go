package main

import (
    "context"
    "encoding/json"
    "fmt"

    "github.com/go-redis/redis/v8"
)

type Voto struct {
    Sede  int `json:"sede"`
    Municipio string `json:"municipio"`
	Departamento string `json:"departamento"`
	Papeleta string `json:"papeleta"`
	Partido string `json:"partido"`
}

var ctx = context.Background()

var redisClient = redis.NewClient(&redis.Options{
    Addr: "localhost:6379",
})

func main() {
    subscriber := redisClient.Subscribe(ctx, "datos-votos")

    voto := Voto{}

    for {
        msg, err := subscriber.ReceiveMessage(ctx)
        if err != nil {
            panic(err)
        }

        if err := json.Unmarshal([]byte(msg.Payload), &voto); err != nil {
            panic(err)
        }

		//Insertar en mysql

        fmt.Println("Received message from " + msg.Channel + " channel.")
        fmt.Printf("%+v\n", voto)
    }
}