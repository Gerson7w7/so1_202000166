var mysql = require("mysql");

var connectionMYSQL = mysql.createConnection({
  host: "localhost",
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