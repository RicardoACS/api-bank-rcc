const express = require('express')
const accountController = require("../controllers/accountController");
const router = express.Router();


router.get("/accounts/:rut", accountController.getAccountByRut);
router.put("/accounts/:number_account", accountController.updateAmmount);

module.exports = router;
