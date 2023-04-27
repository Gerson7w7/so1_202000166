import React from "react";
import Stats from "./Stats";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [fecha, setFecha] = useState(null); // fecha en tiempo real
  const ip = '104.154.202.112' 

  useEffect(() => {
    const url = `http://${ip}:5000/get-fecha`;
    const fetchData = async () => {
      fetch(url)
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error))
        .then((res) => {
          setFecha(res.fecha);
        });
    };

    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 1000); // Hacer una petición cada 1 segundos

    return () => {
      clearInterval(intervalId);
    };
  }, [fecha]);

  return (
    <div className="main">
    <div className="d-flex justify-content-end">
        <h6 className="text-info">Fecha: { fecha }</h6>
    </div>
      <div className="d-flex justify-content-around">
      <img alt="" className="logo" src="https://virgendelcerro.es/wp-content/uploads/2018/02/007-vote.png"/>
      </div>
      <div className="d-flex justify-content-around">
        <h1>DASHBOARD</h1>
      </div>
      <br /><br />
        <Stats />
    </div>
  );
};

export default Dashboard;