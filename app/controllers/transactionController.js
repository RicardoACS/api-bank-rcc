const express = require("express");
const status = require("../utils/status");
const pool = require("../db/connection_db");
const app = express();
app.use(express.json());

const serviceTransaction = {};

serviceTransaction.createTransaction = async (req, res) => {
  try {
    cleanStatus();
    console.log("[Controller] Se creará una transacción");
    var { ammount, transaction_type_id, account_id, destination_id } = req.body;

    var query =
      "INSERT INTO bank.transactions (created, ammount, transaction_type_id, account_id, destination_id) " +
      "VALUES ($1, $2, $3, $4, $5)";

    await pool.query(query, [
      new Date(),
      ammount,
      transaction_type_id,
      account_id,
      destination_id,
    ]);

    status.message.message = "Transacción creada con éxito";
    return res.status(status.code.success).send(status.message);
  } catch (error) {
    console.error("Ha ocurrido un error al crear la transaccion: ", error);
    status.message.error =
      "Ha ocurrido un error al crear la transacción, intente más tarde";
    return res.status(status.code.error).send(status.message);
  }
};

serviceTransaction.getLastMovements = async (req, res) => {
  try {
    cleanStatus();
    console.log("[Controller] Se obtendrán los últimos movimientos");
    var { id } = req.params;
    var query =
      "SELECT 		tran.created, tran_type.description as type, tran.description, des.name, tran.ammount " +
      "FROM 		bank.transactions tran " +
      "INNER JOIN 	bank.transactions_type tran_type " +
      "ON 			tran.transaction_type_id = tran_type.transactions_type_id " +
      "INNER JOIN 	bank.account ac " +
      "ON 			tran.account_id = ac.account_id " +
      "LEFT JOIN 	bank.destination des " +
      "ON 			tran.transaction_id = des.destination_id " +
      "WHERE 		ac.user_id = $1 " +
      "ORDER BY 	tran.created";
      
      console.log(query)

    var response = await pool.query(query, [id]);

    status.message.data = response.rows;
    status.message.message = "Últimos movimientos obtenidos";
    return res.status(status.code.success).send(status.message);
  } catch (error) {
    console.error(
      "Ha ocurrido un error al obtener los últimos movimientos: ",
      error
    );
    status.message.error =
      "Ha ocurrido un error al obtener los últimos movimientos, intente más tarde";
    return res.status(status.code.error).send(status.message);
  }
};

function cleanStatus() {
  status.message.message = "";
  status.message.error = "";
  status.message.data = [];
}

module.exports = serviceTransaction;
