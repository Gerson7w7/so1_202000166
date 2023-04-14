const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const WebSocket = require('ws');

const app = express();
const port = 5000;
// cors
app.use(cors());
app.use(bodyParser.json());

// Crea una conexión a la base de datos MySQL
const pool = mysql.createPool({
  host: "dbproyecto",
  user: "root",
  password: "root",
  database: "dbproyecto1",
});

app.post("/get-info", async (req, res) => {
  console.log("/get-info");
  try {
    const { municipio, departamento } = req.body;

    // ============== MYSQL =================
    // Realiza las consultas SQL de forma asíncrona utilizando Promesas
    let [votos] = await Promise.all([pool.query("SELECT * FROM voto")]);
    votos = votos[0]; // aquí obtenemos solo la lista

    // Top 3 de departamentos con mayores votos para presidente, en MySQL.
    let graph1 = [];
    for (let i = 0; i < votos.length; i++) {
      let nuevoDepartamento = true;
      // iteramos graph1 para ver si ya está en la lista el departamento
      for (let j = 0; j < graph1.length; j++) {
        if (votos[i].departamento === graph1[j].departamento) {
          // si ya esta en la lista, agregamos un voto
          graph1[j].votos += 1;
          nuevoDepartamento = false;
          break;
        }
      }
      if (nuevoDepartamento) {
        // si no esta en la lista lo añadimos
        graph1.push({ departamento: votos[i].departamento, votos: 1 });
      }
    }
    graph1.sort((x, y) => y.votos - x.votos); // ordenamos de mayor a menor
    graph1 = [graph1[0], graph1[1], graph1[2]]; // obtenemos solo los primeros 3

    // Gráfico circular del porcentaje de votos por partido, según municipio, y departamento, en MySQL.
    let graph2 = [
      { name: "UNE", value: 0 },
      { name: "VAMOS", value: 0 },
      { name: "FCN", value: 0 },
      { name: "UNIONISTA", value: 0 },
      { name: "VALOR", value: 0 },
    ];
    for (let i = 0; i < votos.length; i++) {
      let aux;
      if (municipio === votos[i].municipio) {
        // si se filtra por municipio
        aux = votos[i].partido;
      } else if (departamento === votos[i].departamento) {
        // si se filtra por departamento
        aux = votos[i].partido;
      }
      for (let j = 0; j < graph2.length; j++) {
        if (aux === graph2[j].name) {
          // añadimos un voto al partido correspondiente
          graph2[j].value += 1;
        }
      }
    }

    // ============== REDIS =================
    // Gráfico de barras que muestre las 5 sedes con mayores votos almacenados en Redis.
    let graph3 = [];
    for (let i = 0; i < votos.length; i++) {
      let nuevaSede = true;
      // iteramos graph3 para ver si ya está en la lista la sede
      for (let j = 0; j < graph3.length; j++) {
        if (votos[i].sede === graph3[j].sede) {
          // si ya esta en la lista la sede, agregamos un voto
          graph3[j].votos += 1;
          nuevaSede = false;
          break;
        }
      }
      if (nuevaSede) {
        // si no esta en la lista lo añadimos
        graph3.push({ sede: votos[i].sede, votos: 1 });
      }
    }
    graph3.sort((x, y) => y.votos - x.votos); // ordenamos de mayor a menor
    graph3 = [graph3[0], graph3[1], graph3[2], graph3[3], graph3[4]]; // obtenemos solo los primeros 5

    // Últimos 5 votos almacenados en Redis.
    let graph4 = [];
    let contador = 0;
    for (let i = votos.length - 1; i >= 0; i--) {
      graph4.push({ name: votos[i].papeleta, value: 1 })
      contador++
      if (contador === 5) break; 
    }

    // Envía la respuesta con los resultados de todas las consultas
    res.format({
      "application/json": function () {
        res.send({
          tabla: votos,
          graph1: graph1,
          graph2: graph2,
          graph3: graph3,
          graph4: graph4
        });
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener la información");
  }
});

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Nueva conexión WebSocket establecida');

  const sendDate = () => {
    const date = new Date();
    console.log("fecha: ", date)
    ws.send(JSON.stringify({ date: date }));
  };

  // Envía la fecha actual al cliente cada 1 segundos
  const timerId = setInterval(sendDate, 1000);

  // Escucha el evento "close" del cliente
  ws.on('close', () => {
    console.log('Conexión WebSocket cerrada');

    // Detiene el temporizador cuando el cliente se desconecta
    clearInterval(timerId);
  });
});
