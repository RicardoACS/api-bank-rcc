import { Request as Req, Response as Res } from 'express'
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const getDestinationByAccountId = async (req: Req, res: Res) => {
    try {
        console.log("[Controller] Retornará todos los destinatarios de la cuenta");
        var { id } = req.params;

        const resport = await prisma.destination.findMany({
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
                rut: true,
            },
            where: {
                account_id: Number(id)
            }
        })

        prisma.$disconnect()
        res.status(200).json(resport)
    } catch (error) {
        console.error("Ha ocurrido un error al obtener los destinatarios: ", error);
        var messageError = "Ha ocurrido un error al obtener los destinatarios, intente más tarde";
        res.status(500).json({ data: [], error: messageError });
    }
};

export const createDestination = async (req: Req, res: Res) => {
    try {
        console.log("[Controller] Crea un destinatario");
        var { rut, name, email, account_number, account_id, bank_id } = req.body;

        const validate = await prisma.account.findFirst({
            where: {
                user: {
                    rut,
                    AND: {
                        account: {
                            every: {
                                number: Number(account_number).toString()
                            }
                        }
                    }
                }
            }
        });

        if (validate == null) {
            res.status(500).json({ data: [], error: "Cuenta no existe en nuestros sistemas" });
        }

        await prisma.destination.create({
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
                email,
                name,
                rut
            }
        })

        prisma.$disconnect()
        res.status(200).json({ data: [] })
    } catch (error) {
        console.error("Ha ocurrido un error al obtener los destinatarios: ", error);
        var messageError = "Ha ocurrido un error al obtener los destinatarios, intente más tarde";
        res.status(500).json({ data: [], error: messageError });
    }
};

