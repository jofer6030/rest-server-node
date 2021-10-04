const { Router } = require("express");
const { check } = require("express-validator");

const {
  esAdminRole,
  validarCampos,
  validarJWT,
  tieneRole,
} = require("../middlewares");

const {
  esRolValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

const {
  userGet,
  userPut,
  userPost,
  userDelete,
} = require("../controllers/userController");

const router = Router();

router.get("/", userGet);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId().bail(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  userPut
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe tener almenos 6 caracteres").isLength({
      min: 6,
    }),
    check("correo", "El correo no es válido").isEmail(),
    check("correo").custom(emailExiste),
    // check('rol','No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check("rol").custom(esRolValido), //custom((rol) => esRolValido(rol)) se obvia el rol por q es el mismo nombre y solo es esRolValido
    validarCampos,
  ],
  userPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE", "OTRO_ROLE"),
    check("id", "No es un ID válido").isMongoId().bail(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  userDelete
);

module.exports = router;
