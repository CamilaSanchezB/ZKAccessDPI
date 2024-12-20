const { leerRegistrosExistentes } = require("../utils/cargaCSV.util");
const {ruta_bd, ruta_csv_usuarios} = require("../config.js");
const odbc = require("odbc");

async function obtenerNuevosUsuarios() {
  const usuariosExistentes = await leerRegistrosExistentes(ruta_csv_usuarios);
  const idsExistentes = new Set(
    usuariosExistentes.map((usuario) => parseInt(usuario.USERID))
  );
  const cadenaConexion = `Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=${ruta_bd};`;
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
    console.error("ERROR obtenerNuevosUsuarios:", error?.message || error);
  }
}

module.exports = { obtenerNuevosUsuarios };
