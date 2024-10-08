const fs = require("fs");
const fastcsv = require("fast-csv");
const { ruta_csv_usuarios, API_KEY } = require("../config.js");

async function leerUsuariosExistentes() {
  return new Promise((resolve, reject) => {
    const usuarios = [];
    fs.createReadStream(ruta_csv_usuarios)
      .pipe(fastcsv.parse({ headers: true }))
      .on("data", (fila) => usuarios.push(fila))
      .on("end", () => {
        resolve(usuarios);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function almacenarUsuariosCSV(usuarios) {
  try {
    const writableStream = fs.createWriteStream(ruta_csv_usuarios);
    fastcsv
      .write(usuarios, { headers: true })
      .on("finish", () => {
        console.log(`Los registros se han guardado en ${ruta_csv_usuarios}`);
      })
      .pipe(writableStream);
  } catch (e) {
    console.error(e.message);
  }
}

module.exports = { leerUsuariosExistentes, almacenarUsuariosCSV };
