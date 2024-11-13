const { ruta_csv_fichadas } = require("../config");
const {
  cargarRegistrosCSV,
  obtenerRegistrosPorPin,
} = require("./cargaCSV.util");
const path = require("path");
const { format } = require("date-fns");

function deberiaAgregarRegistro(registro, lastTime, tiempoLimite) {
  return (
    !lastTime || new Date(registro.time) - new Date(lastTime) > tiempoLimite
  );
}

function procesarRegistros(registros) {
  // Ordenar por pin y luego por tiempo

  registros.sort((a, b) => {
    const comparacionPorPin = a.pin.localeCompare(b.pin);
    return comparacionPorPin !== 0
      ? comparacionPorPin
      : new Date(a.time) - new Date(b.time);
  });
  const registrosFiltrados = [];
  const timeLimit = 5 * 60 * 1000; // 5 minutos en milisegundos
  for (let i = 0; i < registros.length; i++) {
    const pinActual = registros[i].pin;
    const dataFichadas = obtenerRegistrosPorPin(
      path.join(ruta_csv_fichadas, `${format(new Date(), "yyyy-MM-dd")}.csv`),
      pinActual
    );

    if (dataFichadas.length > 0) {
      const ultimoTimeFichado = dataFichadas[dataFichadas.length - 1].time;

      if (
        i === 0 ||
        pinActual !== registros[i - 1].pin ||
        (deberiaAgregarRegistro(registros[i], ultimoTimeFichado, timeLimit) &&
          new Date(registros[i].time) - new Date(registros[i - 1].time) >
            timeLimit)
      ) {
        registrosFiltrados.push(registros[i]);
      }
    } else if (
      i === 0 ||
      pinActual !== registros[i - 1].pin ||
      new Date(registros[i].time) - new Date(registros[i - 1].time) > timeLimit
    ) {
      registrosFiltrados.push(registros[i]);
    }
  }
  return registrosFiltrados;
}

function formatearYCargarFichadas(fichadas) {
  fichadas.map((d) => {
    delete d["cantidad"];
  });

  if (fichadas.length > 0) {
    cargarRegistrosCSV(
      fichadas,
      path.join(ruta_csv_fichadas, `${format(new Date(), "yyyy-MM-dd")}.csv`),
      Object.keys(fichadas[0])
    );
  } else {
    console.log("No se registraron nuevas fichadas.");
  }
}
module.exports = { procesarRegistros, formatearYCargarFichadas };
