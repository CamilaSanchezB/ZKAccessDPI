const { ruta_csv_usuarios } = require("../config");
const { obtenerNuevosUsuarios } = require("../services/usuarios.service");
const { cargarRegistrosCSV } = require("../utils/cargaCSV.util");

async function cargarNuevoUsuario(usuario) {
  try {
    const response = await axios.post(
      `https://api-prod.humand.co/public/api/v1/users`,
      usuario,
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

async function obtenerYCargarUsuarios() {
  try {
    let nuevos_usuarios = await obtenerNuevosUsuarios();
    if (nuevos_usuarios?.length > 0) {
      await cargarRegistrosCSV(nuevos_usuarios, ruta_csv_usuarios, Object.keys(nuevos_usuarios[0]));
      let promises = nuevos_usuarios?.map((usuario) =>
        //   cargarNuevoUsuario({...usuario, password:`${usuario.name?.split(" ")[0][0]?.toLowerCase()}${usuario.lastname?.split(" ")[0]?.toLowerCase()}`})
        console.log("cargando usuario", usuario.Badgenumber)
      );
      await Promise.allSettled(promises);
    } else {
      console.log("No se registraron nuevos usuarios");
    }
  } catch (e) {
    console.error("ERROR obtenerYMostrarUsuarios: ", e?.message || e);
  }
}

module.exports = { cargarNuevoUsuario, obtenerYCargarUsuarios };
