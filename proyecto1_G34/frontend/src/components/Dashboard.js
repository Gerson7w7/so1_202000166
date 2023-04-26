import React from "react";
import Stats from "./Stats";
import WebSocket from 'isomorphic-ws';
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [fecha, setFecha] = useState(null); // fecha en tiempo real
  const ip = 'api-svc' 

  useEffect(() => {
    const socket = new WebSocket(`ws://${ip}:5000`);
    socket.onmessage = (event) => {
      const date = JSON.parse(event.data).date;
      setFecha(date);
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