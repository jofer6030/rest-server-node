const { Router } = require("express");
const { check } = require("express-validator");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");
const { existeProductoPorId } = require("../helpers/db-validators");
const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");

const router = Router();

router.get("/", getProducts);

router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId().bail(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  getProduct
);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El Nombre es obligatorio").not().isEmpty(),
    check("categoria", "La categoria es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  createProduct
);
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId().bail(),
    check("id").custom(existeProductoPorId),
    check("nombre", "El Nombre es obligatorio").not().isEmpty(),
    check("categoria", "La categoria es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  updateProduct
);
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId().bail(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  deleteProduct
);

module.exports = router;
