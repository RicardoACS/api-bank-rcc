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
exports.getLastMovements = exports.createTransferThirdParties = exports.createTransaction = void 0;
var emailController_1 = require("./emailController");
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var createTransaction = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ammount, transaction_type_id, account_id, destination_id, description, transaction, myAccount, update, error_1, messageError;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                console.log("[Controller] Se creará una transacción");
                _a = req.body, ammount = _a.ammount, transaction_type_id = _a.transaction_type_id, account_id = _a.account_id, destination_id = _a.destination_id, description = _a.description;
                return [4 /*yield*/, prisma.transactions.create({
                        data: {
                            account: {
                                connect: {
                                    account_id: account_id
                                }
                            },
                            ammount: ammount,
                            created: new Date,
                            description: description,
                            transactions_type: {
                                connect: {
                                    transactions_type_id: transaction_type_id
                                }
                            },
                            destination: destination_id
                        }
                    })];
            case 1:
                transaction = _b.sent();
                prisma.$disconnect();
                if (!(transaction != null)) return [3 /*break*/, 4];
                return [4 /*yield*/, prisma.account.findFirst({
                        where: {
                            account_id: account_id
                        }
                    })];
            case 2:
                myAccount = _b.sent();
                return [4 /*yield*/, prisma.account.update({
                        data: {
                            ammount: (myAccount === null || myAccount === void 0 ? void 0 : myAccount.ammount) + ammount
                        },
                        where: {
                            account_id: account_id
                        }
                    })];
            case 3:
                update = _b.sent();
                _b.label = 4;
            case 4:
                prisma.$disconnect();
                res.status(200).json({ data: [] });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                console.error("Ha ocurrido un error al modificar la cuenta: ", error_1);
                messageError = "Ha ocurrido un error al modificar la cuenta, intente más tarde";
                res.status(500).json({ data: [], error: messageError });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createTransaction = createTransaction;
var createTransferThirdParties = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var dateCreation, _a, ammount, transaction_type_id, account_id, destination_id, description, rut, name_origen, transaction, myAccount, accountDestination, transactionThird, error_2, messageError;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 8, , 9]);
                console.log("[Controller] Se creará una transferencia a tercero");
                dateCreation = new Date;
                _a = req.body, ammount = _a.ammount, transaction_type_id = _a.transaction_type_id, account_id = _a.account_id, destination_id = _a.destination_id, description = _a.description, rut = _a.rut, name_origen = _a.name_origen;
                return [4 /*yield*/, prisma.transactions.create({
                        data: {
                            account: {
                                connect: {
                                    account_id: account_id
                                }
                            },
                            ammount: ammount,
                            created: dateCreation,
                            description: description,
                            transactions_type: {
                                connect: {
                                    transactions_type_id: transaction_type_id
                                }
                            },
                            destination: {
                                connect: {
                                    destination_id: destination_id
                                }
                            }
                        },
                        select: {
                            destination: {
                                select: {
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    })];
            case 1:
                transaction = _d.sent();
                if (!(transaction != null)) return [3 /*break*/, 7];
                return [4 /*yield*/, prisma.account.findFirst({
                        select: {
                            account_id: true,
                            number: true,
                            ammount: true,
                            user: {
                                select: {
                                    email: true
                                }
                            }
                        },
                        where: {
                            account_id: account_id
                        }
                    })];
            case 2:
                myAccount = _d.sent();
                return [4 /*yield*/, prisma.account.update({
                        data: {
                            ammount: (myAccount === null || myAccount === void 0 ? void 0 : myAccount.ammount) != undefined ? (myAccount === null || myAccount === void 0 ? void 0 : myAccount.ammount) - ammount : 0
                        },
                        where: {
                            account_id: account_id
                        }
                    })
                    //Se actualiza la cuenta del destinatario
                ];
            case 3:
                _d.sent();
                return [4 /*yield*/, prisma.account.findFirst({
                        where: {
                            user: {
                                rut: rut
                            }
                        }
                    })];
            case 4:
                accountDestination = _d.sent();
                return [4 /*yield*/, prisma.transactions.create({
                        data: {
                            account: {
                                connect: {
                                    account_id: accountDestination === null || accountDestination === void 0 ? void 0 : accountDestination.account_id
                                }
                            },
                            ammount: ammount,
                            created: dateCreation,
                            description: "Transferencia de " + name_origen,
                            transactions_type: {
                                connect: {
                                    transactions_type_id: 2
                                }
                            }
                        }
                    })];
            case 5:
                transactionThird = _d.sent();
                return [4 /*yield*/, prisma.account.update({
                        data: {
                            ammount: (accountDestination === null || accountDestination === void 0 ? void 0 : accountDestination.ammount) + ammount
                        },
                        where: {
                            account_id: accountDestination === null || accountDestination === void 0 ? void 0 : accountDestination.account_id
                        }
                    })];
            case 6:
                _d.sent();
                emailController_1.sendEmailNewTransferClient(name_origen, myAccount === null || myAccount === void 0 ? void 0 : myAccount.user.email, dateCreation, (_b = transaction.destination) === null || _b === void 0 ? void 0 : _b.name, description, myAccount === null || myAccount === void 0 ? void 0 : myAccount.number, ammount, accountDestination === null || accountDestination === void 0 ? void 0 : accountDestination.number);
                emailController_1.sendEmailNewTransferDestination(name_origen, (_c = transaction.destination) === null || _c === void 0 ? void 0 : _c.email, ammount, dateCreation);
                _d.label = 7;
            case 7:
                prisma.$disconnect();
                res.status(200).json({ data: [] });
                return [3 /*break*/, 9];
            case 8:
                error_2 = _d.sent();
                console.error("Ha ocurrido un error al realizar la transacción: ", error_2);
                messageError = "Ha ocurrido un error al realizar la transacción, intente más tarde";
                res.status(500).json({ data: [], error: messageError });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.createTransferThirdParties = createTransferThirdParties;
var getLastMovements = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, error_3, messageError;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.transactions.findMany({
                        select: {
                            created: true,
                            transactions_type: {
                                select: {
                                    description: true
                                }
                            },
                            description: true,
                            destination: {
                                select: {
                                    name: true,
                                    bank: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            },
                            ammount: true
                        },
                        where: {
                            account: {
                                user_id: Number(id)
                            }
                        }
                    })];
            case 1:
                result = _a.sent();
                prisma.$disconnect();
                return [2 /*return*/, res.status(200).json(result)];
            case 2:
                error_3 = _a.sent();
                console.error("Ha ocurrido un error al consultar los últimos movimientos: ", error_3);
                messageError = "Ha ocurrido un error al consultar los últimos movimientos, intente más tarde";
                return [2 /*return*/, res.status(500).json({ data: [], error: messageError })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getLastMovements = getLastMovements;
//# sourceMappingURL=transactionController.js.map