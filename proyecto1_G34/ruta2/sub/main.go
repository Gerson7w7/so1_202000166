package main

import (
    "context"
    "encoding/json"
    "fmt"

    "github.com/go-redis/redis/v8"

    "database/sql"                     // Interactuar con bases de datos
	_ "github.com/go-sql-driver/mysql" // La librería que nos permite conectar a MySQL
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
    Addr: "dbredis:6379",
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
        err = insertar(voto)
		if err != nil {
			fmt.Println("Error insertando: %v", err)
		} else {
			fmt.Println("Insertado correctamente")
		}

        fmt.Println("Received message from " + msg.Channel + " channel.")
        fmt.Printf("%+v\n", voto)
    }
}

func obtenerBaseDeDatos() (db *sql.DB, e error) {
	usuario := "root"
	pass := "root"
	host := "tcp(dbmysql:3306)"
	nombreBaseDeDatos := "dbproyecto1"
	// Debe tener la forma usuario:contraseña@host/nombreBaseDeDatos
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@%s/%s", usuario, pass, host, nombreBaseDeDatos))
	if err != nil {
		return nil, err
	}
	return db, nil
}

func insertar(v Voto) (e error) {
	db, err := obtenerBaseDeDatos()
	if err != nil {
		return err
	}
	defer db.Close()

	// Preparamos para prevenir inyecciones SQL
	sentenciaPreparada, err := db.Prepare("INSERT INTO voto (sede, municipio, departamento, papeleta, partido) VALUES(?, ?, ?, ?, ?)")
	if err != nil {
		return err
	}
	defer sentenciaPreparada.Close()
	// Ejecutar sentencia, un valor por cada '?'
	_, err = sentenciaPreparada.Exec(v.Sede, v.Municipio, v.Departamento, v.Papeleta, v.Partido)
	if err != nil {
		return err
	}
	return nil
}