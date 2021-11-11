const { Router } = require("express");
const { check } = require("express-validator");
const {
  cargarArchivo,
  actualizarImagen,
  mostrarImg,
  actualizarImagenCloudinary,
} = require("../controllers/uploadsController");
const { coleccionesPermitidas } = require("../helpers");

const { validarCampos, validarArchivo } = require("../middlewares");

const router = Router();

router.post("/", validarArchivo, cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validarArchivo,
    check("id", "No es un ID válido").isMongoId(),
    check("coleccion").custom(
      (c) => coleccionesPermitidas(c, ["usuarios", "productos"]) //"c" es el valor que viene de :coleccion
    ),
    validarCampos,
  ],
  actualizarImagenCloudinary
  // actualizarImagen
);

router.get(
  "/:coleccion/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("coleccion").custom(
      (c) => coleccionesPermitidas(c, ["usuarios", "productos"]) //"c" es el valor que viene de :coleccion
    ),
    validarCampos,
  ],
  mostrarImg
);

module.exports = router;
