var mysql = require("mysql2");

var connectionMYSQL = mysql.createConnection({
  host: "10.8.12.153",
  user: "root",
  password: "root",
  database: "dbproyecto1",
  port: 3306,
});

connectionMYSQL.connect(function (error) {
  if (error) {
    throw error;
  } else {
    console.log("Conn mysql");
  }
});

module.exports = connectionMYSQL;