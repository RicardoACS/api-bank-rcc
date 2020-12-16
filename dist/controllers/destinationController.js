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
exports.createDestination = exports.getDestinationByAccountId = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var getDestinationByAccountId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, resport, error_1, messageError;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log("[Controller] Retornará todos los destinatarios de la cuenta");
                id = req.params.id;
                return [4 /*yield*/, prisma.destination.findMany({
                        select: {
                            account_id: true,
                            account_number: true,
                            bank: {
                                select: {
                                    bank_id: true,
                                    name: true
                                }
                            },
                            created: true,
                            destination_id: true,
                            email: true,
                            name: true,
                            rut: true
                        },
                        where: {
                            account_id: Number(id)
                        }
                    })];
            case 1:
                resport = _a.sent();
                prisma.$disconnect();
                return [2 /*return*/, res.status(200).json(resport)];
            case 2:
                error_1 = _a.sent();
                console.error("Ha ocurrido un error al obtener los destinatarios: ", error_1);
                messageError = "Ha ocurrido un error al obtener los destinatarios, intente más tarde";
                return [2 /*return*/, res.status(500).json({ data: [], error: messageError })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getDestinationByAccountId = getDestinationByAccountId;
var createDestination = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, rut, name, email, account_number, account_id, bank_id, validate, ifExist, error_2, messageError;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                console.log("[Controller] Crea un destinatario");
                _a = req.body, rut = _a.rut, name = _a.name, email = _a.email, account_number = _a.account_number, account_id = _a.account_id, bank_id = _a.bank_id;
                return [4 /*yield*/, prisma.account.findFirst({
                        where: {
                            user: {
                                rut: rut,
                                AND: {
                                    account: {
                                        every: {
                                            number: Number(account_number).toString()
                                        }
                                    }
                                }
                            }
                        }
                    })];
            case 1:
                validate = _b.sent();
                if (validate == null) {
                    return [2 /*return*/, res.status(500).json({ data: [], error: "Cuenta no existe en nuestros sistemas" })];
                }
                return [4 /*yield*/, prisma.destination.findFirst({
                        where: {
                            account_number: Number(account_number).toString(),
                            AND: {
                                account_id: Number(account_id)
                            }
                        }
                    })];
            case 2:
                ifExist = _b.sent();
                if (ifExist != null) {
                    return [2 /*return*/, res.status(409).json({ data: [], error: "Cuenta ya está registrada" })];
                }
                return [4 /*yield*/, prisma.destination.create({
                        data: {
                            account: {
                                connect: {
                                    account_id: Number(account_id)
                                }
                            },
                            account_number: Number(account_number).toString(),
                            bank: {
                                connect: {
                                    bank_id: Number(bank_id)
                                }
                            },
                            created: new Date,
                            email: email,
                            name: name,
                            rut: rut
                        }
                    })];
            case 3:
                _b.sent();
                prisma.$disconnect();
                return [2 /*return*/, res.status(200).json({ data: [] })];
            case 4:
                error_2 = _b.sent();
                console.error("Ha ocurrido un error al obtener los destinatarios: ", error_2);
                messageError = "Ha ocurrido un error al obtener los destinatarios, intente más tarde";
                return [2 /*return*/, res.status(500).json({ data: [], error: messageError })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createDestination = createDestination;
//# sourceMappingURL=destinationController.js.map