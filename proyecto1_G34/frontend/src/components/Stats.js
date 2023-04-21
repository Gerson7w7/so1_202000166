import React from "react";
import { useEffect, useState } from "react";
import Grafica1 from "./Grafica1";
import Grafica2 from "./Grafica2";
import Grafica3 from "./Grafica3";
import Grafica4 from "./Grafica4";

const Stats = () => {
  const [municipio, setMunicipio] = useState("");
  const [municipioAux, setMunicipioAux] = useState("");
  const [departamento, setDepartamento] = useState("Guatemala");
  const [departamentoAux, setDepartamentoAux] = useState("");
  const [tabla, setTabla] = useState([]);
  const [graph1, setGraph1] = useState([]);
  const [graph2, setGraph2] = useState([]);
  const [graph3, setGraph3] = useState([]);
  const [graph4, setGraph4] = useState([]);
  const ip = 'localhost'

  useEffect(() => {
    // valores por defecto
    console.log("recargo")

    const url = `http://${ip}:5000/get-info`;
    let data = { municipio: municipio, departamento: departamento };
    const fetchData = async () => {
      fetch(url, {
        method: "POST", // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error))
        .then((res) => {
          console.log("res: ", res);
          setTabla(res.tabla);
          setGraph1(res.graph1);
          setGraph2(res.graph2);
          setGraph3(res.graph3);
          setGraph4(res.graph4);
        });
    };
    const scrollPosition = parseInt(window.name, 10) || 0;
    if (scrollPosition) {
      window.scrollTo(0, scrollPosition);
    }

    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 1000); // Hacer una petición cada 1 segundos

    return () => {
      clearInterval(intervalId);
      window.name = window.pageYOffset;
    };
  }, [departamento, municipio]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setDepartamento(departamentoAux);
    setMunicipio(municipioAux);
  };

  return (
    <div className="main">
      <div className="d-flex justify-content-evenly">
        <div>
          <div className="d-flex justify-content-center">
            <h4>Top 3: departamentos votos para presidente</h4>
          </div>
          <Grafica1 data={graph1} />
        </div>

        <div>
          <div className="d-flex justify-content-center">
            <h4>Porcentaje de votos por partido</h4>
          </div>
          <Grafica2 data={graph2} />
          <form onSubmit={handleSubmit}>
            <fieldset>
              <div className="form-group">
                <label htmlFor="municipio" className="form-label mt-4">
                  Municipio
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="municipio"
                  aria-describedby="emailHelp"
                  defaultValue={municipio}
                  onChange={(event) => setMunicipioAux(event.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="departamento" className="form-label mt-4">
                  Departamento
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="departamento"
                  aria-describedby="emailHelp"
                  defaultValue={departamento}
                  onChange={(event) => setDepartamentoAux(event.target.value)}
                />
              </div>
              <br />
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-success">
                  Confirmar
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>

      <div className="d-flex justify-content-evenly">
        <div>
          <div className="d-flex justify-content-center">
            <h4>Top 5: sedes con mayores votos almacenados</h4>
          </div>
          <Grafica3 data={graph3} />
        </div>

        <div>
          <div className="d-flex justify-content-center">
            <h4>Ultimos 5 votos</h4>
          </div>
          <Grafica4 data={graph4} />
        </div>
      </div>

      <div>
        <div className="d-flex justify-content-evenly">
          <h1>DATOS EN MYSQL</h1>
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
                      Sede
                    </th>
                    <th className="table-dark" scope="col">
                      Municipio
                    </th>
                    <th className="table-active" scope="col">
                      Departamento
                    </th>
                    <th className="table-dark" scope="col">
                      Papeleta
                    </th>
                    <th className="table-active" scope="col">
                      Partido
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tabla.map((v, index) => (
                    <tr key={index + 1}>
                      <th className="table-primary" scope="row">
                        {index + 1}
                      </th>
                      <td className="table-success">{v.sede}</td>
                      <td className="table-warning">{v.municipio}</td>
                      <td className="table-success">{v.departamento}</td>
                      <td className="table-warning">{v.papeleta}</td>
                      <td className="table-success">{v.partido}</td>
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
