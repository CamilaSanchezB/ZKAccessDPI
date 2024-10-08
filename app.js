"use strict";

const { obtenerYCargarUsuarios } = require("./controllers/usuarios.controller");

// async function listUserInfo() {
//   const connectionString = `Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=${ruta_test};`;
//   try {
//     const connection = await odbc.connect(connectionString);
//     const result = await connection.query(
//       "SELECT USERID, Badgenumber FROM USERINFO"
//     );
//     console.log("USERINFO Records:", JSON.stringify(result, null, 2));

//     // Crear un archivo CSV y escribir los datos
//     const writableStream = fs.createWriteStream(ruta_csv);
//     fastcsv
//       .write(result, { headers: true })
//       .on("finish", () => {
//         console.log(`Los registros se han guardado en ${ruta_csv}`);
//       })
//       .pipe(writableStream);

//     await connection.close();
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

obtenerYCargarUsuarios();
