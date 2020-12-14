const express = require('express')
const userController = require("../controllers/userController");
const router = express.Router();


router.post("/users", userController.createUser);
router.post("/users/login", userController.loginUser);
router.get("/users/:rut", userController.getUserByRut);

module.exports = router;
