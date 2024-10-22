"use strict";
const { obtenerYCargarFichadas } = require("./controllers/fichadas.controller.js");
const { obtenerYCargarUsuarios } = require("./controllers/usuarios.controller.js");

obtenerYCargarUsuarios();
obtenerYCargarFichadas();
