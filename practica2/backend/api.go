package main

import (
	"fmt"
	"os/exec"
)

// api para la obtension de la info de los modulos de ram y cpu
func main() {
	// RAM
	cmd := exec.Command("sh", "-c", "cat /proc/ram_202000166")
	out, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	output := string(out[:])
	fmt.Println(output)

	// CPU
	cmd = exec.Command("sh", "-c", "cat /proc/cpu_202000166")
	out, err = cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	output = string(out[:])
	fmt.Println(output)
}
