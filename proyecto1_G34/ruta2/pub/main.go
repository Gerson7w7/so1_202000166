package main

import (
	"context"
    "encoding/json"
    "strconv"
    "github.com/go-redis/redis/v8"
    "github.com/gofiber/fiber/v2"
    "fmt"
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
    Addr: "redis-svc:6379",
})

func main() {
    fmt.Printf("hloaaaaaaaaa")
    app := fiber.New()

    app.Get("/", func(c *fiber.Ctx) error {
        return c.SendStatus(200)
    })

    app.Post("/add-voto", func(c *fiber.Ctx) error {
        voto := new(Voto)

        if err := c.BodyParser(voto); err != nil {
            panic(err)
            return c.SendStatus(500)
        }

        payload, err := json.Marshal(voto)
        if err != nil {
            panic(err)
            return c.SendStatus(500)
        }

        if err := redisClient.Publish(ctx, "datos-votos", payload).Err(); err != nil {
            panic(err)
            return c.SendStatus(500)
        }

        //Se incrementa y obtieene el contador de votos
        contador, err := redisClient.Incr(ctx, "contador").Result()
        
        //Se guarda el nuevo voto en Redis
        err = redisClient.Set(ctx, strconv.Itoa(int(contador)), payload, 0).Err()
        if err != nil {
            panic(err)
            return c.SendStatus(500)
        }

        fmt.Printf("se insertoooo")
        return c.SendStatus(200)
    })

    app.Listen(":4100")
}