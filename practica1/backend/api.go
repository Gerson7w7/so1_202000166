package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/rs/cors"
)

type Operacion struct {
	Num1  string `json:"num1"`
	Num2  string `json:"num2"`
	Signo string `json:"signo"`
}

type Resultado struct {
	Res string `json:"res"`
}

type Log struct {
	Num1      string `json:"num1"`
	Num2      string `json:"num2"`
	Operacion string `json:"operacion"`
	Resultado string `json:"resultado"`
	Fecha     string `json:"fecha"`
	EsError   string `json:"esError"`
}

// función para la conexión a la bd
func conexionBD() (conexion *sql.DB) {
	Driver := "mysql" // driver de mysql
	Usuario := "root"
	Constrasenia := "secret"
	Nombre := "dbpractica1" // nombre de la database
	Port := "3306"

	conexion, err := sql.Open(Driver, Usuario+":"+Constrasenia+"@tcp(127.0.0:"+Port+")/"+Nombre) // root:secret@tcp(127.0.0:3306)/dbpractica1
	if err != nil {
		panic(err.Error())
	}
	return conexion
}

// función para realizar las operaciones aritméticas
func ejecOperacion(op Operacion) (int, string) {
	num1, err1 := strconv.Atoi(op.Num1)
	num2, err2 := strconv.Atoi(op.Num2)
	if err1 != nil || err2 != nil {
		return 0, "Error de sintaxis, no se puede ingresar operadores seguidos."
	}
	if op.Signo == "x" {
		return num1 * num2, ""
	} else if op.Signo == "/" {
		if num2 == 0 {
			return 0, "Error. No se puede dividir un número entre 0. Indefinido."
		}
		return num1 / num2, ""
	} else if op.Signo == "+" {
		return num1 + num2, ""
	}
	return num1 - num2, ""
}

func main() {
	// creando el servidor y corriéndolo
	mux := http.NewServeMux()

	// endpoints
	mux.HandleFunc("/resultado", func(w http.ResponseWriter, r *http.Request) {
		println("/resultado")
		// obteniendo la operación a realizar desde el front
		var op Operacion
		json.NewDecoder(r.Body).Decode(&op)

		// realizando la operación
		res, err := ejecOperacion(op)
		var resultado Resultado
		var esError = 0
		if err != "" {
			esError = 1
			resultado = Resultado{Res: err}
		} else {
			resultado = Resultado{Res: strconv.Itoa(res)}
		}
		// actualizando la bd
		conexionEstablecida := conexionBD()
		insertarRegistro, err2 := conexionEstablecida.Prepare("INSERT INTO operaciones(num1, num2, operacion, resultado, fecha, esError) VALUES(?,?,?,?,?,?)")
		if err2 != nil {
			panic(err2.Error())
		}
		fecha := time.Now()
		insertarRegistro.Exec(op.Num1, op.Num2, op.Signo, strconv.Itoa(res), fecha.String(), strconv.Itoa(esError))
		// cerramos conexión
		conexionEstablecida.Close()

		// regresando el resultado al front
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resultado)
	})

	mux.HandleFunc("/log", func(w http.ResponseWriter, r *http.Request) {
		println("/log")
		conexionEstablecida := conexionBD()
		registros, err := conexionEstablecida.Query("SELECT * FROM operaciones")
		if err != nil {
			panic(err.Error())
		}
		// leemos todos los logs de la bd
		log := Log{}
		logs := []Log{}
		for registros.Next() {
			var num1, num2, operacion, resultado, fecha, esError string
			err = registros.Scan(&num1, &num2, &operacion, &resultado, &fecha, &esError)
			if err != nil {
				panic(err.Error())
			}
			log.Num1 = num1
			log.Num2 = num2
			log.Operacion = operacion
			log.Resultado = resultado
			log.Fecha = fecha
			log.EsError = esError
			// agregamos el log al arreglo de logs
			logs = append(logs, log)
		}
		fmt.Println(logs)
		// cerramos conexión
		conexionEstablecida.Close()

		// regresando el resultado al front
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(logs)
	})

	handler := cors.Default().Handler(mux)
	println("Server are running on port: localhost:5000")
	http.ListenAndServe(":5000", handler)
}
