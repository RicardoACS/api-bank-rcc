"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importStar(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var bankController_1 = require("./controllers/bankController");
var userController_1 = require("./controllers/userController");
var accountController_1 = require("./controllers/accountController");
var transactionController_1 = require("./controllers/transactionController");
var destinationController_1 = require("./controllers/destinationController");
var app = express_1["default"]();
app.use(morgan_1["default"]('tiny'));
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
var router = express_1.Router();
// Rutas del Banco
router.get('/v1/banks', bankController_1.getAllBanks);
router.post('/v1/users', userController_1.createUser);
router.get('/v1/accounts/:id', accountController_1.getAccountById);
router.get('/v1/users/:rut', userController_1.getUserByRut);
router.post('/v1/users/login', userController_1.login);
router.post('/v1/transactions', transactionController_1.createTransaction);
router.post('/v1/transactions/third-parties', transactionController_1.createTransferThirdParties);
router.get('/v1/transactions/:id', transactionController_1.getLastMovements);
router.post('/v1/destinations', destinationController_1.createDestination);
router.get('/v1/destinations/:id', destinationController_1.getDestinationByAccountId);
app.use(router);
app.listen(process.env.PORT, function () { return console.log('Servidor funcionando en el puerto ${process.env.PORT}'); });
//# sourceMappingURL=index.js.map