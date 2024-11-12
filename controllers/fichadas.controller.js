const { obtenerFichadas } = require("../services/fichadas.service");
const { formatearYCargarFichadas } = require("../utils/fichadas.util");
const { leerRegistrosExistentes } = require("../utils/cargaCSV.util");
const path = require("path");
const { ruta_csv_fichadas } = require("../config");
const { format } = require("date-fns");

async function cargarEntrada(fichada) {
  try {
    const response = await axios.post(
      `https://api-prod.humand.co/public/api/v1/time-tracking/entries/clockIn`,
      {
        employeeId: fichada.pin,
        now: fichada.time,
        comment: "Generado por sistema de integracion"
      },
      {
        headers: {
          Authorization: "Basic " + API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("ERROR cargarNuevoUsuario: ",error?.message || error);
  }
}
async function cargarSalida(fichada) {
  try {
    const response = await axios.post(
      `https://api-prod.humand.co/public/api/v1/time-tracking/entries/clockOut`,
      {
        employeeId: fichada.pin,
        now: fichada.time,
        comment: "Generado por sistema de integracion"
      },
      {
        headers: {
          Authorization: "Basic " + API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("ERROR cargarNuevoUsuario: ",error?.message || error);
  }
}


async function obtenerYCargarFichadas() {
  try {
    let fichadas = await obtenerFichadas();
   
    let first = false;
    let registrosViejos = await leerRegistrosExistentes(
      path.join(ruta_csv_fichadas, `${format(new Date(), "yyyy-MM-dd")}.csv`)
    );
    let registrosNuevos = [];

    if (registrosViejos.length === 0) {
      first = true;
      registrosNuevos = fichadas.map((d) => ({
        ...d,
        cantidad: 0,
      })); // Si registrosViejos está vacío, agregar cantidad 0
    } else {
      registrosNuevos = fichadas
        .filter(
          (d1) => !registrosViejos.some((d2) => d1.ID.toString() === d2.ID)
        )
        .map((d1) => {
          // Contar cuántos registros hay con el mismo pin en registrosViejos
          const cantidad = registrosViejos.filter(
            (d2) => d2.pin === d1.pin
          ).length;
          return { ...d1, cantidad }; // Agregar el campo cantidad
        }); 
    }

    let promises = registrosNuevos?.map((reg) =>
      console.log(
        (parseInt(reg.cantidad) + 1) % 2 === 0
          ? "Cargando salida"
          : "Cargando entrada"
      )
    );
    await Promise.allSettled(promises);
    formatearYCargarFichadas(registrosNuevos);
  } catch (e) {
    console.error("ERROR obtenerYCargarFichadas: ", e?.message || e);
  }
}

module.exports = { obtenerYCargarFichadas };
