const { format } = require("path");
const path = require("path");
const fs = require("fs");
const fastcsv = require("fast-csv");


async function cargarRegistrosCSV(registros, ruta, headers) {
  try {
    const writableStream = fs.createWriteStream(ruta, { flags: 'a' });

    // Verificar si el archivo existe y tiene contenido
    const fileExists = fs.existsSync(ruta);
    if (!fileExists || fs.readFileSync(ruta, 'utf8').trim().length === 0) {
      // Si no existe o está vacío, escribir los encabezados
      writableStream.write(headers.join(',') + '\n'); // Agregar encabezados
    }

    fastcsv
      .write(registros, { headers: false })
      .on('finish', () => {
        console.log(`Los registros se han guardado en ${ruta}`);
        const writableStream2 = fs.createWriteStream(ruta, { flags: 'a' });
        writableStream2.write('\n');
        writableStream2.end();
        writableStream2.close();
      })
      .pipe(writableStream);
      
  } catch (e) {
    console.error('ERROR cargarRegistrosCSV: ', e?.message || e);
  }
}

async function leerRegistrosExistentes(ruta) {
  return new Promise((resolve, reject) => {
    const registros = [];

    // Verificar si el archivo existe
    fs.access(ruta, fs.constants.F_OK, (err) => {
      if (err) {
        // Si el archivo no existe, devolver un array vacío
        return resolve(registros);
      }

      fs.createReadStream(ruta)
        .pipe(fastcsv.parse({ headers: true }))
        .on("data", (fila) => registros.push(fila))
        .on("end", () => {
          resolve(registros);
        })
        .on("error", (error) => {
          reject("ERROR leerRegistrosExistentes: " + (error?.message || error));
        });
    });
  });
}


function obtenerRegistrosPorPin(nombreArchivo, pinBuscado) {
    const registrosFiltrados = [];

    // Leer el archivo CSV
    const csvData = fs.readFileSync(nombreArchivo, 'utf8');
    const lineas = csvData.trim().split('\n');

    // Obtener el encabezado
    const encabezado = lineas[0].split(',');

    // Procesar las líneas restantes
    for (let i = 1; i < lineas.length; i++) {
        const fila = lineas[i].split(',');
        const registro = {};

        // Crear un objeto para cada fila
        for (let j = 0; j < encabezado.length; j++) {
            registro[encabezado[j]] = fila[j];
        }

        // Filtrar por pin
        if (registro.pin === String(pinBuscado)) {
            registrosFiltrados.push(registro);
        }
    }

    return registrosFiltrados;
}

module.exports = {
  cargarRegistrosCSV,
  leerRegistrosExistentes,
  obtenerRegistrosPorPin
};
