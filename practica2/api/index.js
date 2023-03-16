const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const app = express();
const port = 5000;
// cors
app.use(cors());

// Crea una conexión a la base de datos MySQL
const pool = mysql.createPool({
  host: "130.211.192.93",
  user: "root",
  password: "your_password",
  database: "dbpractica2",
});

app.get("/get-info", async (req, res) => {
  try {
    // Realiza las consultas SQL de forma asíncrona utilizando Promesas
    const [ram, cpu, procesos, subprocesos] = await Promise.all([
      pool.query("SELECT * FROM ram"),
      pool.query("SELECT * FROM cpu"),
      pool.query("SELECT * FROM proceso"),
      pool.query("SELECT * FROM subproceso"),
    ]);
    console.log('datos enviados :D')
    // Envía la respuesta con los resultados de todas las consultas
    res.format({
      'application/json': function(){  
        res.send({
          'ram': ram,
          'cpu': cpu,
          'procesos': procesos,
          'subprocesos': subprocesos,
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
