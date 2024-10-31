"use strict";
const {
  obtenerYCargarFichadas,
} = require("./controllers/fichadas.controller.js");
const {
  obtenerYCargarUsuarios,
} = require("./controllers/usuarios.controller.js");
const { obtenerRegistrosPorPin } = require("./utils/cargaCSV.util.js");
const path = require("path");
const { ruta_csv_fichadas } = require("./config.js");
const { format } = require("date-fns");
obtenerYCargarUsuarios();
obtenerYCargarFichadas();

// console.log(obtenerRegistrosPorPin(
//     path.join(ruta_csv_fichadas, `${format(new Date(), "yyyy-MM-dd")}.csv`), '12'
//   ));
