package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"os/exec"
	"os/user"
	"strconv"
	"time"

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
	Constrasenia := "your_password"
	Nombre := "dbpractica2" // nombre de la database
	Port := "3306"
	Host := "130.211.192.93"

	conexion, err := sql.Open(Driver, Usuario+":"+Constrasenia+"@tcp("+Host+":"+Port+")/"+Nombre) // root:secret@tcp(127.0.0:3306)/dbpractica1
	if err != nil {
		fmt.Println("error 1")
		panic(err.Error())
	}
	return conexion
}

func borrarRegistros(conexionEstablecida *sql.DB, cpu_id int) int {
	_, err := conexionEstablecida.Exec("DELETE FROM subproceso WHERE 1=1;")
	if err != nil {
		fmt.Println("error 2")
		panic(err.Error())
	}
	_, err = conexionEstablecida.Exec("DELETE FROM proceso WHERE 1=1;")
	if err != nil {
		fmt.Println("error 3")
		panic(err.Error())
	}

	if (cpu_id == 11) {
		_, err = conexionEstablecida.Exec("DELETE FROM cpu WHERE 1=1;")
		if err != nil {
			fmt.Println("error 4")
			panic(err.Error())
		}
		_, err = conexionEstablecida.Exec("DELETE FROM ram WHERE 1=1;")
		if err != nil {
			fmt.Println("error 5")
			panic(err.Error())
		}
		cpu_id = 1
	}
	return cpu_id
}

// api para la obtension de la info de los modulos de ram y cpu
func main() {
	cpu_id := 1
	for {
		// RAM
		cmd := exec.Command("sh", "-c", "cat /proc/ram_202000166")
		out, err := cmd.CombinedOutput()
		if err != nil {
			fmt.Println("error 6")
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
			fmt.Println("error 7")
			fmt.Println(err)
		}
		output = string(out[:])
		// pasamos a un struct la cpu y sus procesos
		cpu := CPU{}
		json.Unmarshal([]byte(output), &cpu)

		// establecemos conexión con la bd
		conexionEstablecida := conexionBD()
		// ELIMINAMOS EL CONTENIDO DE CADA TABLA
		cpu_id = borrarRegistros(conexionEstablecida, cpu_id)

		// insertamos en la tabla de RAM
		insertarRegistro, err2 := conexionEstablecida.Prepare("INSERT INTO ram(id, ram_usada) VALUES(?,?)")
		if err2 != nil {
			fmt.Println("error 8")
			panic(err2.Error())
		}
		ramUsada := 100.00 * (float64(ram.Totalram) - float64(ram.Freeram)) / float64(ram.Totalram)
		insertarRegistro.Exec(cpu_id, ramUsada)

		// insertamos en la tabla de CPU
		insertarRegistro, err2 = conexionEstablecida.Prepare("INSERT INTO cpu(id, cpu_usage, running_processes, sleeping_processes, stopped_processes, zombie_processes, total_processes) VALUES(?,?,?,?,?,?,?)")
		if err2 != nil {
			fmt.Println("error 9")
			panic(err2.Error())
		}
		cpuUsage := float64(cpu.Cpu_usage) / 10000000.00
		insertarRegistro.Exec(cpu_id, cpuUsage, cpu.Running_processes, cpu.Sleeping_processes, cpu.Stopped_processes, cpu.Zombie_processes, cpu.Total_processes)

		// ahora iteramos para guardar todos los procesos
		proceso_id := 1
		for i := 0; i < len(cpu.Procesos); i++ {
			// insertamos en la tabla de PROCESO
			insertarRegistro, err2 = conexionEstablecida.Prepare("INSERT INTO proceso(id, pid, _name, _uid, ram_usada, estado, cpu_id) VALUES(?,?,?,?,?,?,?)")
			if err2 != nil {
				fmt.Println("error 10")
				panic(err2.Error())
			}
			u, err := user.LookupId(strconv.Itoa(cpu.Procesos[i].Uid))
			username := ""
			if err != nil {
				username = "root"
			} else {
				username = u.Username
			}
			ramUsada = 100.00 * (float64(cpu.Procesos[i].Ram_usada.Freeram) / float64(cpu.Procesos[i].Ram_usada.Totalram))
			insertarRegistro.Exec(proceso_id, cpu.Procesos[i].Pid, cpu.Procesos[i].Name, username, ramUsada, cpu.Procesos[i].Estado, cpu_id)

			// ahora iteramos para guardar todos los sub-procesos
			subproceso_id := 1
			for j := 0; j < len(cpu.Procesos[i].Hijos); j++ {
				// insertamos en la tabla de SUBPROCESO
				insertarRegistro, err2 = conexionEstablecida.Prepare("INSERT INTO subproceso(id, pid, nombre, proceso_id) VALUES(?,?,?,?)")
				if err2 != nil {
					fmt.Println("error 11")
					panic(err2.Error())
				}
				insertarRegistro.Exec(subproceso_id, cpu.Procesos[i].Hijos[j].Pid, cpu.Procesos[i].Hijos[j].Nombre, proceso_id)
				subproceso_id++
			}
			// aumentamos para tener el id del proceso actual
			proceso_id++
		}

		// cerramos conexión
		conexionEstablecida.Close()

		// aumentamos para tener el id del cpu actual
		cpu_id++
		fmt.Println("DATOS INSERTADOS :DD")

		time.Sleep(1 * time.Second) // Espera 1 segundo
	}
}
