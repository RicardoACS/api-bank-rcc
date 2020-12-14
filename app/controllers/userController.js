const express = require("express");
const status = require("../utils/status");
const pool = require("../db/connection_db");
const { createAccount } = require("./accountController");
const app = express();
app.use(express.json());

const serviceUser = {};
/**
 * Método para la creación de usuarios
 * @param {*} req Request de la consulta
 * @param {*} res response
 */
serviceUser.createUser = async (req, res) => {
  try {
    cleanStatus();
    console.log("[Controller] Se creará un usuario");
    const { rut, name, email, password } = req.body;

    var queryUser = "SELECT * FROM bank.user WHERE rut = $1";
    var responseUser = await pool.query(queryUser, [rut]);

    if (responseUser.rowCount > 0) {
      status.message.data = [];
      status.message.error = "Usuario ya existe en el sistema";
      return res.status(status.code.conflict).send(status.message);
    }

    var user = await pool.query(
      "INSERT INTO bank.user (rut, name, email, password, created) VALUES ($1, $2, $3, $4, $5) returning *",
      [rut, name, email, password, new Date()]
    );

    createAccount(user.rows[0].user_id);

    status.message.data = user.rows[0];
    status.message.message = "Usuario creado con exito";
    return res.status(status.code.success).send(status.message);
  } catch (error) {
    console.error("Ha ocurrido un error al crear el usuario: ", error);
    status.message.error =
      "No se ha podido crear el usuario, intente más tarde";
    return res.status(status.code.error).send(status.message);
  }
};

/**
 * Método para obtener al usuario
 * @param {*} req
 * @param {*} res
 */
serviceUser.getUserByRut = async (req, res) => {
  try {
    cleanStatus();
    console.log("[Controller] Se buscará un usuario por RUT");
    var { rut } = req.params;
    var query = "SELECT * FROM bank.user WHERE rut = $1";

    const response = await pool.query(query, [rut]);

    if (response.rowCount == 0) {
      status.message.error = "Usuario buscado no encontrado";
      return res.status(status.code.notfound).send(status.message);
    }

    status.message.data = response.rows[0];
    return res.status(status.code.success).send(status.message);
  } catch (error) {
    console.error("Ha ocurrido un error al buscar el usuario: ", rut, error);
    status.message.error =
      "No se ha podido buscar el usuario, intente más tarde";
    return res.status(status.code.error).send(status.message);
  }
};

serviceUser.loginUser = async (req, res) => {
  try {
    cleanStatus();
    console.log("[Controller] Se Logeará un usuario");
    var { rut, password } = req.body;

    var query =
      "SELECT user_id, rut, name, email FROM bank.user WHERE rut = $1 AND password = $2";

    const response = await pool.query(query, [rut, password]);

    if (response.rowCount == 0) {
      status.message.error = "Credenciales invalidas, intente nuevamente";
      return res.status(status.code.badRequest).send(status.message);
    }

    status.message.data = response.rows[0];
    return res.status(status.code.success).send(status.message);
  } catch (error) {
    console.error("Ha ocurrido un error en el login: ", rut, error);
    status.message.error =
      "Ha ocurrido un error en el login, intente más tarde";
    return res.status(status.code.error).send(status.message);
  }
};



function cleanStatus() {
  status.message.message = "";
  status.message.error = "";
  status.message.data = [];
}

module.exports = serviceUser;
