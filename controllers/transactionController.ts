import { sendEmailNewTransferClient, sendEmailNewTransferDestination } from './emailController';
import { Request as Req, Response as Res } from 'express'
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const createTransaction = async (req: Req, res: Res) => {
    try {
        console.log("[Controller] Se creará una transacción");
        var {
            ammount,
            transaction_type_id,
            account_id,
            destination_id,
            description,
        } = req.body;

        //Se crea la transacción
        const transaction = await prisma.transactions.create({
            data: {
                account: {
                    connect: {
                        account_id
                    }
                },
                ammount,
                created: new Date,
                description,
                transactions_type: {
                    connect: {
                        transactions_type_id: transaction_type_id
                    }
                },
                destination: destination_id
            }
        })

        prisma.$disconnect()
        if (transaction != null) {
            //Se actualiza la cuenta del usuario
            const myAccount = await prisma.account.findFirst({
                where: {
                    account_id
                }
            })
            const update = await prisma.account.update({
                data: {
                    ammount: myAccount?.ammount + ammount
                },
                where: {
                    account_id
                }
            })
        }

        prisma.$disconnect()
        res.status(200).json({ data: [] })
    } catch (error) {
        console.error("Ha ocurrido un error al modificar la cuenta: ", error);
        var messageError = "Ha ocurrido un error al modificar la cuenta, intente más tarde";
        res.status(500).json({ data: [], error: messageError });
    }
}

export const createTransferThirdParties = async (req: Req, res: Res) => {
    try {
        console.log("[Controller] Se creará una transferencia a tercero");
        let dateCreation = new Date;
        var {
            ammount,
            transaction_type_id,
            account_id,
            destination_id,
            description,
            rut,
            name_origen
        } = req.body;

        //Se crea la transacción
        const transaction = await prisma.transactions.create({
            data: {
                account: {
                    connect: {
                        account_id
                    }
                },
                ammount,
                created: dateCreation,
                description,
                transactions_type: {
                    connect: {
                        transactions_type_id: transaction_type_id
                    }
                },
                destination: {
                    connect: {
                        destination_id
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
        })

        if (transaction != null) {
            //Se actualiza la cuenta del usuario
            const myAccount = await prisma.account.findFirst({
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
                    account_id
                }
            })
            await prisma.account.update({
                data: {
                    ammount: myAccount?.ammount != undefined ? myAccount?.ammount - ammount : 0
                },
                where: {
                    account_id
                }
            })

            //Se actualiza la cuenta del destinatario
            const accountDestination = await prisma.account.findFirst({
                where: {
                    user: {
                        rut
                    }
                }
            })

            const transactionThird = await prisma.transactions.create({
                data: {
                    account: {
                        connect: {
                            account_id: accountDestination?.account_id
                        }
                    },
                    ammount,
                    created: dateCreation,
                    description: "Transferencia de " + name_origen,
                    transactions_type: {
                        connect: {
                            transactions_type_id: 2
                        }
                    }
                }
            })

            await prisma.account.update({
                data: {
                    ammount: accountDestination?.ammount + ammount
                },
                where: {
                    account_id: accountDestination?.account_id
                }
            })
            sendEmailNewTransferClient(name_origen, myAccount?.user.email, dateCreation, transaction.destination?.name, description, myAccount?.number , ammount, accountDestination?.number );
            sendEmailNewTransferDestination(name_origen, transaction.destination?.email, ammount, dateCreation );
        }
        
        prisma.$disconnect()
        res.status(200).json({ data: [] })
    } catch (error) {
        console.error("Ha ocurrido un error al realizar la transacción: ", error);
        var messageError = "Ha ocurrido un error al realizar la transacción, intente más tarde";
        res.status(500).json({ data: [], error: messageError });
    }
}

export const getLastMovements = async (req: Req, res: Res) => {
    try {
        var { id } = req.params;

        const result = await prisma.transactions.findMany({
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
            },
            orderBy: {
                created: "asc"
            }
        })
        prisma.$disconnect()
        return res.status(200).json(result)
    } catch (error) {
        console.error("Ha ocurrido un error al consultar los últimos movimientos: ", error);
        var messageError = "Ha ocurrido un error al consultar los últimos movimientos, intente más tarde";
        return res.status(500).json({ data: [], error: messageError });
    }
}
