const { Router } = require("express");
const { check } = require("express-validator");
const { crearUsuario, login, revalidarToken } = require("../controllers/auth");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validators");

const router = Router();

//crear nuevo usuario
router.post(
  "/new",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email").not().isEmpty().withMessage("El email es obligatorio"),
    check("email", "El email no es correcto").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearUsuario
);

//login usuario
router.post(
  "/",
  [
    check("email").not().isEmpty().withMessage("El email es obligatorio"),
    check("email").isEmail().withMessage("El email no es valido"),
    check("password").not().isEmpty().withMessage("El password es obligatorio"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("El password debe tener al menos 6 caracteres"),
    validarCampos,
  ],
  login
);

//Validar token
router.get("/renew", validarJWT, revalidarToken);

module.exports = router;
