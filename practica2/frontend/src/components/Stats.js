import React from "react";
import { useEffect, useState } from "react";
import Grafica from "./Grafica";

const Stats = () => {
  const [ramS, setRamS] = useState([]);
  const [estadoS, setEstadoS] = useState([]);
  const [cpuS, setCpuS] = useState([]);
  const [procesosS, setProcesosS] = useState([]);

  useEffect(() => {
    const url = "http://localhost:5000/get-info";

    const fetchData = async () => {
      fetch(url, {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error))
        .then((res) => {
          const { ram, cpu, procesos, subprocesos } = res;
          // obtenemos los datos de la ram para poder graficarlos
          let _ram = [];
          for (let i = 0; i < ram[0].length; i++) {
            _ram.push({ name: ram[0][i].id, uv: ram[0][i].ram_usada });
          }
          // obtenemos los datos de la ram para poder graficarlos
          let _cpu = [];
          for (let i = 0; i < cpu[0].length; i++) {
            _cpu.push({ name: cpu[0][i].id, uv: cpu[0][i].cpu_usage });
          }
          let _procesos = [];
          for (let i = 0; i < procesos[0].length; i++) {
            let proceso = {
              id: procesos[0][i].id,
              pid: procesos[0][i].pid,
              _name: procesos[0][i]._name,
              _uid: procesos[0][i]._uid,
              ram_usada: procesos[0][i].ram_usada,
              estado: procesos[0][i].estado,
              cpu_id: procesos[0][i].cpu_id,
              hijos: [],
            };
            for (let j = 0; j < subprocesos[0].length; j++) {
              if (procesos[0][i].id === subprocesos[0][j].proceso_id){
                proceso.hijos.push(subprocesos[0][j]);
              }
            }
            _procesos.push(proceso);
          }
          setCpuS(_cpu);
          setRamS(_ram);
          setProcesosS(_procesos);
          setEstadoS(cpu[0]);
          console.log(_procesos)
        });
    };
    const scrollPosition = parseInt(window.name, 10) || 0;
    if (scrollPosition) {
      window.scrollTo(0, scrollPosition);
    }

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000); // Hacer una petición cada 5 segundos

    return () => {
      clearInterval(intervalId);
      window.name = window.pageYOffset;
    };
  }, []);

  return (
    <div className="main">
      <div className="d-flex justify-content-evenly">
        <div>
          <div className="d-flex justify-content-center">
            <img
              alt=""
              className="logo-p"
              src="https://cdn-icons-png.flaticon.com/512/1892/1892518.png"
            />
          </div>
          <Grafica data={cpuS} />
        </div>
        <div>
          <div className="d-flex justify-content-center">
            <img
              alt=""
              className="logo-p largo"
              src="https://esferas.org/mt/msqlu/pgb-ram.png"
            />
          </div>
          <Grafica data={ramS} />
        </div>
      </div>
      <div>
        <div className="d-flex justify-content-evenly">
          <h1>PROCESOS</h1>
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th className="table-dark" scope="col">
                      Estado
                    </th>
                    <th className="table-active" scope="col">
                      Cantidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={1}>
                    <th className="table-primary" scope="row">
                      Procesos corriendo
                    </th>
                    <th className="table-primary" scope="row">
                      {estadoS[estadoS.length - 1]?.running_processes}
                    </th>
                  </tr>
                  <tr key={2}>
                    <th className="table-primary" scope="row">
                      Procesos durmiendo
                    </th>
                    <td className="table-primary">
                      {estadoS[estadoS.length - 1]?.sleeping_processes}
                    </td>
                  </tr>
                  <tr key={3}>
                    <th className="table-primary" scope="row">
                      Procesos parados
                    </th>
                    <td className="table-primary">
                      {estadoS[estadoS.length - 1]?.stopped_processes}
                    </td>
                  </tr>
                  <tr key={4}>
                    <th className="table-primary" scope="row">
                      Procesos zombies
                    </th>
                    <td className="table-primary">
                      {estadoS[estadoS.length - 1]?.zombie_processes}
                    </td>
                  </tr>
                  <tr key={5}>
                    <th className="table-primary" scope="row">
                      Procesos totales
                    </th>
                    <td className="table-primary">
                      {estadoS[estadoS.length - 1]?.total_processes}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th className="table-dark" scope="col">
                      No.
                    </th>
                    <th className="table-active" scope="col">
                      pid
                    </th>
                    <th className="table-dark" scope="col">
                      nombre
                    </th>
                    <th className="table-active" scope="col">
                      uid
                    </th>
                    <th className="table-dark" scope="col">
                      RAM %
                    </th>
                    <th className="table-active" scope="col">
                      estado
                    </th>
                    <th className="table-dark" scope="col">
                      Hijos
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {procesosS.map((proceso) => (
                    <tr key={proceso.id}>
                      <th className="table-primary" scope="row">
                        {proceso.id}
                      </th>
                      <td className="table-success">{proceso.pid}</td>
                      <td className="table-warning">{proceso._name}</td>
                      <td className="table-success">{proceso._uid}</td>
                      <td className="table-warning">{proceso.ram_usada}</td>
                      <td className="table-success">{proceso.estado}</td>
                      <td className="table-warning">
                        <button
                          className="btn btn-primary"
                          type="button"
                          data-bs-toggle="offcanvas"
                          data-bs-target={"#offcanvasExample"+proceso.id}
                          aria-controls={"offcanvasExample"+proceso.id}
                        >
                          Ver
                        </button>
                        <div
                          className="offcanvas offcanvas-start"
                          tabindex="-1"
                          id={"offcanvasExample"+proceso.id}
                          aria-labelledby="offcanvasExampleLabel"
                        >
                          <div className="offcanvas-header">
                            <h5
                              className="offcanvas-title"
                              id="offcanvasExampleLabel"
                            >
                              Hijos
                            </h5>
                            <button
                              type="button"
                              className="btn-close text-reset"
                              data-bs-dismiss="offcanvas"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="offcanvas-body">
                            <div>
                              <table className="table table-hover">
                                <thead>
                                  <tr>
                                    <th className="table-dark" scope="col">
                                      No.
                                    </th>
                                    <th className="table-active" scope="col">
                                      pid
                                    </th>
                                    <th className="table-dark" scope="col">
                                      nombre
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {proceso.hijos.map((sub) => (
                                    <tr key={sub.id}>
                                      <th className="table-primary" scope="row">
                                        {sub.id}
                                      </th>
                                      <td className="table-success">{sub.pid}</td>
                                      <td className="table-warning">{sub.nombre}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
