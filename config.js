const path = require("path");
const ruta_test = path.join(__dirname, "test.mdb");
const ruta_csv_usuarios = path.join(__dirname, "data", "userinfo.csv");
const API_KEY = process.env.API_KEY;
module.exports = { ruta_test, ruta_csv_usuarios, API_KEY };
