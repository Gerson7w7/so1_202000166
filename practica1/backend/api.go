package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

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

func ejecOperacion(op Operacion) int {
	num1, err1 := strconv.Atoi(op.Num1)
	num2, err2 := strconv.Atoi(op.Num2)
	if err1 != nil || err2 != nil {
		return 0
	}
	if op.Signo == "x" {
		return num1 * num2
	} else if op.Signo == "/" {
		return num1 / num2
	} else if op.Signo == "+" {
		return num1 + num2
	}
	return num1 - num2
}

func main() {
	// creando el servidor y corriéndolo
	mux := http.NewServeMux()

	// endpoints
	mux.HandleFunc("/resultado", func(w http.ResponseWriter, r *http.Request) {
		println("/resultado")
		// leyendo el body
		var op Operacion
		json.NewDecoder(r.Body).Decode(&op)
		// ejecutamos la operacion
		res := ejecOperacion(op)
		fmt.Println(res)
		// ahora respondemos la peticion
		resultado := Resultado{Res: strconv.Itoa(res)}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resultado)
	})

	handler := cors.Default().Handler(mux)
	println("Server are running on port: localhost:5000")
	http.ListenAndServe(":5000", handler)
}
