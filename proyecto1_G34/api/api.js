const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
// cors
app.use(cors());
app.use(bodyParser.json());

// Crea una conexión a la base de datos MySQL
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "dbproyecto1",
});

app.post("/get-info", async (req, res) => {
console.log('/get-info')
  try {
    const { municipio, departamento } = req.body;
    console.log(municipio, ", ", departamento)
    // Realiza las consultas SQL de forma asíncrona utilizando Promesas
    const [votos] = await Promise.all([
      pool.query("SELECT * FROM voto"),
    ]);

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
            graph1.push({departamento: votos[i].departamento, votos: 0})
        }
    }

    // Gráfico circular del porcentaje de votos por partido, según municipio, y departamento, en MySQL. 
    let graph2 = [
        { name: 'UNE', value: 0},
        { name: 'VAMOS', value: 0},
        { name: 'FCN', value: 0},
        { name: 'UNIONISTA', value: 0},
        { name: 'VALOR', value: 0},
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

    // Envía la respuesta con los resultados de todas las consultas
    res.format({
      'application/json': function(){  
        res.send({
          tabla: votos
        });  
      },  
    })
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener la información");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});