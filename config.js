const path = require("path");
// const ruta_test = path.join("C:", "ZKTeco", "ZKAccess3.5", "ZKAccess.mdb");
const ruta_test = path.join(__dirname, "test.mdb");
const ruta_csv = path.join(__dirname, "data");
const ruta_csv_usuarios = path.join(ruta_csv, "userinfo.csv");
const ruta_csv_fichadas = path.join(ruta_csv, "fichadas");
const API_KEY = process.env.API_KEY;
module.exports = { ruta_test, ruta_csv_usuarios, ruta_csv_fichadas, API_KEY };
