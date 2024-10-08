const { obtenerNuevosUsuarios } = require("../services/usuarios.service");
const { almacenarUsuariosCSV } = require("../utils/usuarios.util");

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
    console.error(error?.message || error);
  }
}

async function obtenerYCargarUsuarios() {
  try {
    let nuevos_usuarios = await obtenerNuevosUsuarios();
    if (nuevos_usuarios?.length > 0) {
      await almacenarUsuariosCSV(nuevos_usuarios);
      let promises = nuevos_usuarios?.map((usuario) =>
        //   cargarNuevoUsuario(usuario)
        console.log("cargando usuario", usuario.Badgenumber)
      );
      await Promise.allSettled(promises);
    } else {
      console.log("No se registraron nuevos usuarios");
    }
  } catch (e) {
    console.error("obtenerYMostrarUsuarios: ", e?.message || e);
  }
}

module.exports = { cargarNuevoUsuario, obtenerYCargarUsuarios };
