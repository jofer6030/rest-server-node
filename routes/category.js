const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearCategory,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { existeCategoriaPorId } = require("../helpers/db-validators");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

//Obtener todas las categorias - publico
router.get("/", getCategories);

//Obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId().bail(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  getCategory
);

//Crear categoria - privado - cualquier persona con un token válido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategory
);

//Actualizar categoria - privado - cualquier persona con un token válido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId().bail(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  updateCategory
);

//Borrar categoria - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId().bail(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  deleteCategory
);

module.exports = router;
