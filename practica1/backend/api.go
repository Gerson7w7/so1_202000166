package main

import (
	"fmt"
	"net/http"
)

func main() {
	// endpoints
	http.HandleFunc("/resultado", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "HOLAAA")
	})

	// creando el servidor y corriéndolo
	api := http.Server{
		Addr: ":5000",
	}
	println("Server are running on port: localhost:5000")
	err := api.ListenAndServe()
	if err != nil {
		panic(err)
	}
}
