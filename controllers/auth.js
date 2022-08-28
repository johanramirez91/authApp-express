const { response } = require("express");
const Usuario = require("../models/Usuario.js");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { name, email, password } = req.body;

  try {
    //verificar email
    let usuario = await Usuario.findOne({ email: email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe",
      });
    }

    usuario = new Usuario(req.body);

    //hash contraseña
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(password, salt);

    //generar jwt
    const token = await generarJWT(usuario.id, usuario.name);

    await usuario.save();
    return res.status(201).json({
      ok: true,
      uid: usuario._id,
      name: usuario.name,
      email,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: "Error al crear usuario",
    });
  }
};

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const userDb = await Usuario.findOne({ email: email });
    if (!userDb) {
      return res.status(400).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }

    //confirmar los passwords
    const validPassword = bcrypt.compareSync(password, userDb.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password no válido",
      });
    }

    //generar jwt
    const token = await generarJWT(userDb.id, userDb.name);

    return res.json({
      ok: true,
      uid: userDb.id,
      name: userDb.name,
      email: userDb.email,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: "Error al crear usuario",
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const { uid } = req;

  const dbUser = await Usuario.findById(uid);

  const token = await generarJWT(uid, dbUser.name);
  return res.json({
    ok: true,
    uid,
    name: dbUser.name,
    email: dbUser.email,
    token,
  });
};

module.exports = {
  crearUsuario,
  login,
  revalidarToken,
};
