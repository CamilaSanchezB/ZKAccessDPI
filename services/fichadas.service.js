
const {ruta_bd} = require("../config.js");
const odbc = require("odbc");
const { procesarRegistros } = require("../utils/fichadas.util.js");

async function obtenerFichadas() {
    const connectionString = `Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=${ruta_bd};`;
    try {
      const connection = await odbc.connect(connectionString);
      const result = await connection.query(
        `SELECT ID, pin, time FROM acc_monitor_log WHERE DateValue(time) = Date()  AND pin <> ' ';`
      );
      await connection.close();
      
      return procesarRegistros(result);      
    } catch (error) {
      console.error("Error:", error);
    }
  }

  module.exports = {obtenerFichadas}