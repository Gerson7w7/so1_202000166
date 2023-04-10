const express = require("express");
const app = express();
const PORT = 3000;
const mysql = require("mysql2");

const db = mysql.createConnection({
    user: "root",
    password: "root",
    host: "localhost",
    database: "dbproyecto1"
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Server Status: OK");
});

app.post("/add", (req, res) => {
    db.query(`INSERT INTO voto (sede, municipio, departamento, papeleta, partido)
        VALUES ('${req.body.sede}', '${req.body.municipio}', '${req.body.departamento}',
                '${req.body.papeleta}', '${req.body.partido}')`)
    res.status(200).send({"message":"ok"});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));