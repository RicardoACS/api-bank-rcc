const express = require("express");
const status = require("../utils/status");
const pool = require("../db/connection_db");
const app = express();
app.use(express.json());

const serviceAccount = {};

serviceAccount.createAccount = (req) => {
  try {
    cleanStatus();
    console.log("[Controller] Se creará una cuenta");

    var query =
      "INSERT INTO bank.account (user_id, ammount, number) VALUES ($1, $2, $3)";

    pool.query(query, [req, 0, Math.round(Math.random() * 10000000)]);

    status.message.message = "Cuenta creada con éxito";
  } catch (error) {
    console.error("Ha ocurrido un error al crear la cuenta: ", error);
    status.message.error = "No se ha podido crear la cuenta, intente más tarde";
  }
};

serviceAccount.getAccountByRut = async (req, res) => {
  try {
    cleanStatus();
    console.log("[Controller] Se buscará una cuenta por rut");
    var { rut } = req.params;
    var query =
      "SELECT ac.account_id, ac.ammount, ac.number FROM bank.account ac " +
      "INNER JOIN bank.user us ON ac.user_id = us.user_id WHERE us.rut = $1";

    var response = await pool.query(query, [rut]);

    status.message.data = response.rows;
    return res.status(status.code.success).send(status.message);
  } catch (error) {
    console.error(
      "Ha ocurrido un error al buscar la cuenta del usuario: ",
      rut,
      error
    );
    status.message.error =
      "No se ha podido buscar la cuenta, intente más tarde";
    return res.status(status.code.error).send(status.message);
  }
};

serviceAccount.updateAmmount = async (req, res) => {
  try {
    cleanStatus();
    console.log("[Controller] Se modificará una cuenta");
    var { ammount } = req.body;
    var { number_account } = req.params;

    var query =
      "UPDATE bank.account SET ammount = ammount + $1 WHERE number = $2";

    await pool.query(query, [ammount, number_account]);

    status.message.message = "Cuenta actualizada con éxito";
    return res.status(status.code.success).send(status.message);
  } catch (error) {
    console.error("Ha ocurrido un error al actualizar la cuenta: ", error);
    status.message.error =
      "Ha ocurrido un error al actualizar la cuenta, intente más tarde";
    return res.status(status.code.error).send(status.message);
  }
};

function cleanStatus() {
  status.message.message = "";
  status.message.error = "";
  status.message.data = [];
}

module.exports = serviceAccount;
