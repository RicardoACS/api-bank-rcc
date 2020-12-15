"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.login = exports.getUserByRut = exports.createUser = void 0;
var emailController_1 = require("./emailController");
var client_1 = require("@prisma/client");
var bcrypt = require('bcrypt');
var prisma = new client_1.PrismaClient();
var createUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, rut, name, email, password, searchUser, hash, createdUser, createdAccount, user, error_1, messageError;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                console.log("[Controller] Se creará un usuario");
                _a = req.body, rut = _a.rut, name = _a.name, email = _a.email, password = _a.password;
                return [4 /*yield*/, prisma.user.findFirst({
                        where: { rut: rut }
                    })];
            case 1:
                searchUser = _b.sent();
                if (searchUser) {
                    res.status(409).json({ data: [], error: "Usuario ya se encuentra en el sistema" });
                }
                return [4 /*yield*/, bcrypt.hash(password, 10)
                    //Creará el usuario, ya que no está creado.
                ];
            case 2:
                hash = _b.sent();
                return [4 /*yield*/, prisma.user.create({
                        data: {
                            email: email,
                            name: name,
                            password: hash,
                            rut: rut,
                            created: new Date
                        }
                    })
                    //Una vez que se haya creado el usuario, se crea la cuenta.
                ];
            case 3:
                createdUser = _b.sent();
                return [4 /*yield*/, prisma.account.create({
                        data: {
                            ammount: 0,
                            number: (Math.round(Math.random() * 10000000)).toString(),
                            user: {
                                connect: {
                                    user_id: createdUser.user_id
                                }
                            }
                        }
                    })];
            case 4:
                createdAccount = _b.sent();
                return [4 /*yield*/, prisma.user.findFirst({
                        select: {
                            user_id: true,
                            created: true,
                            email: true,
                            name: true,
                            rut: true,
                            account: true,
                            password: false
                        },
                        where: {
                            user_id: createdUser.user_id
                        }
                    })];
            case 5:
                user = _b.sent();
                emailController_1.sendEmailCreateUser(user === null || user === void 0 ? void 0 : user.name, user === null || user === void 0 ? void 0 : user.email);
                prisma.$disconnect();
                res.status(200).json(user);
                return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                console.error("Ha ocurrido un error al crear el usuario: ", error_1);
                messageError = "Ha ocurrido un error al crear el usuario, intente más tarde";
                res.status(500).json({ data: [], error: messageError });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.createUser = createUser;
var getUserByRut = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var rut, result, error_2, messageError;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log("[Controller] Se buscará un usuario por RUT");
                rut = req.params.rut;
                return [4 /*yield*/, prisma.user.findFirst({
                        where: {
                            rut: rut
                        },
                        select: {
                            user_id: true,
                            account: true,
                            created: true,
                            email: true,
                            name: true,
                            password: false
                        }
                    })];
            case 1:
                result = _a.sent();
                prisma.$disconnect();
                res.status(200).json(result);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Ha ocurrido un error al buscar el usuario: ", error_2);
                messageError = "Ha ocurrido un error al buscar el usuario, intente más tarde";
                res.status(500).json({ data: [], error: messageError });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserByRut = getUserByRut;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, rut, password, loginUser, compare, error_3, messageError;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                console.log("[Controller] Se Logeará un usuario");
                _a = req.body, rut = _a.rut, password = _a.password;
                return [4 /*yield*/, prisma.user.findFirst({
                        where: {
                            rut: rut
                        },
                        select: {
                            user_id: true,
                            created: true,
                            email: true,
                            name: true,
                            account: true,
                            rut: true,
                            password: true
                        }
                    })];
            case 1:
                loginUser = _b.sent();
                if (loginUser == null) {
                    return [2 /*return*/, res.status(404).json({ data: [], error: "Credenciales invalidas" })];
                }
                return [4 /*yield*/, bcrypt.compare(password, loginUser === null || loginUser === void 0 ? void 0 : loginUser.password)];
            case 2:
                compare = _b.sent();
                if (!compare) {
                    return [2 /*return*/, res.status(404).json({ data: [], error: "Credenciales invalidas" })];
                }
                prisma.$disconnect();
                return [2 /*return*/, res.status(200).json(loginUser)];
            case 3:
                error_3 = _b.sent();
                console.error("Ha ocurrido un error al ingresar al sistema: ", error_3);
                messageError = "Ha ocurrido un error al sistema, intente más tarde";
                return [2 /*return*/, res.status(500).json({ data: [], error: messageError })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
//# sourceMappingURL=userController.js.map