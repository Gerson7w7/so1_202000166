package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"os/exec"

	_ "github.com/go-sql-driver/mysql"
)

type RAM struct {
	Totalram int `json:"totalram"`
	Freeram  int `json:"freeram"`
}

type SubProceso struct {
	Pid    int    `json:"pid"`
	Nombre string `json:"nombre"`
}

type Proceso struct {
	Pid       int          `json:"pid"`
	Name      string       `json:"name"`
	Uid       int          `json:"uid"`
	Ram_usada RAM          `json:"ram_usada"`
	Estado    string       `json:"estado"`
	Hijos     []SubProceso `json:"hijos"`
}

type CPU struct {
	Procesos           []Proceso `json:"procesos"`
	Cpu_usage          int       `json:"cpu_usage"`
	Running_processes  int       `json:"running_processes"`
	Sleeping_processes int       `json:"sleeping_processes"`
	Stopped_processes  int       `json:"stopped_processes"`
	Zombie_processes   int       `json:"zombie_processes"`
	Total_processes    int       `json:"total_processes"`
}

// función para la conexión a la bd
func conexionBD() (conexion *sql.DB) {
	Driver := "mysql" // driver de mysql
	Usuario := "root"
	Constrasenia := "password"
	Nombre := "dbpractica2" // nombre de la database
	Port := "3306"

	conexion, err := sql.Open(Driver, Usuario+":"+Constrasenia+"@tcp(localhost:"+Port+")/"+Nombre) // root:secret@tcp(127.0.0:3306)/dbpractica1
	if err != nil {
		panic(err.Error())
	}
	return conexion
}

// api para la obtension de la info de los modulos de ram y cpu
func main() {
	cpu_id := 1

	// RAM
	cmd := exec.Command("sh", "-c", "cat /proc/ram_202000166")
	out, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	output := string(out[:])
	// pasamos a un struct la ram
	ram := RAM{}
	json.Unmarshal([]byte(output), &ram)

	// CPU
	cmd = exec.Command("sh", "-c", "cat /proc/cpu_202000166")
	out, err = cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	output = string(out[:])
	// pasamos a un struct la cpu y sus procesos
	cpu := CPU{}
	json.Unmarshal([]byte(output), &cpu)
	// establecemos la conexión con la base de datos
	conexionEstablecida := conexionBD()

	// insertamos en la tabla de RAM
	insertarRegistro, err2 := conexionEstablecida.Prepare("INSERT INTO ram(ram_usada) VALUES(?)")
	if err2 != nil {
		panic(err2.Error())
	}
	ramUsada := 100.00 * (float64(ram.Totalram) - float64(ram.Freeram)) / float64(ram.Totalram)
	insertarRegistro.Exec(ramUsada)

	// insertamos en la tabla de CPU
	insertarRegistro, err2 = conexionEstablecida.Prepare("INSERT INTO cpu(cpu_usage, running_processes, sleeping_processes, stopped_processes, zombie_processes, total_processes) VALUES(?,?,?,?,?,?)")
	if err2 != nil {
		panic(err2.Error())
	}
	cpuUsage := float64(cpu.Cpu_usage) / 10000000.00
	insertarRegistro.Exec(cpuUsage, cpu.Running_processes, cpu.Sleeping_processes, cpu.Stopped_processes, cpu.Zombie_processes, cpu.Total_processes)

	// ahora iteramos para guardar todos los procesos
	proceso_id := 1
	for i := 0; i < len(cpu.Procesos); i++ {
		// insertamos en la tabla de PROCESO
		insertarRegistro, err2 = conexionEstablecida.Prepare("INSERT INTO proceso(pid, _name, _uid, ram_usada, estado, cpu_id) VALUES(?,?,?,?,?,?)")
		if err2 != nil {
			panic(err2.Error())
		}
		ramUsada = 100.00 * (float64(cpu.Procesos[i].Ram_usada.Freeram) / float64(cpu.Procesos[i].Ram_usada.Totalram))
		insertarRegistro.Exec(cpu.Procesos[i].Pid, cpu.Procesos[i].Name, cpu.Procesos[i].Uid, ramUsada, cpu.Procesos[i].Estado, cpu_id)

		// ahora iteramos para guardar todos los sub-procesos
		for j := 0; j < len(cpu.Procesos[i].Hijos); j++ {
			// insertamos en la tabla de SUBPROCESO
			insertarRegistro, err2 = conexionEstablecida.Prepare("INSERT INTO subproceso(pid, nombre, proceso_id) VALUES(?,?,?)")
			if err2 != nil {
				panic(err2.Error())
			}
			insertarRegistro.Exec(cpu.Procesos[i].Hijos[j].Pid, cpu.Procesos[i].Hijos[j].Nombre, proceso_id)
		}
		// aumentamos para tener el id del proceso actual
		proceso_id++
	}

	// cerramos conexión
	conexionEstablecida.Close()
	// aumentamos para tener el id del cpu actual
	cpu_id++
}
