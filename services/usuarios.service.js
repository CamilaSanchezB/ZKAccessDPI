const { leerUsuariosExistentes } = require("../utils/usuarios.util");
const {ruta_test} = require("../config.js");
const odbc = require("odbc");

async function obtenerNuevosUsuarios() {
  const usuariosExistentes = await leerUsuariosExistentes();
  const idsExistentes = new Set(
    usuariosExistentes.map((usuario) => parseInt(usuario.USERID))
  );
  const cadenaConexion = `Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=${ruta_test};`;
  try {
    const conexion = await odbc.connect(cadenaConexion);
    let resultado = await conexion.query(
      "SELECT USERID, Badgenumber, name, lastname FROM USERINFO WHERE name <> ' ' AND lastname <> ' ';"
    );

    const nuevosUsuarios = resultado.filter(
      (usuario) => !idsExistentes.has(usuario.USERID)
    );
    await conexion.close();
    return nuevosUsuarios;
  } catch (error) {
    console.error("Error obtenerNuevosUsuarios:", error);
  }
}

module.exports = { obtenerNuevosUsuarios };
