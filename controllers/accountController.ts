import { Request as Req, Response as Res } from 'express'
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const getAccountById = async (req: Req, res: Res) => {
    try {
        console.log("[Controller] Consulta la cuenta del cliente");
        var { id } = req.params;

        const result = await prisma.account.findFirst({
            where: {
                user_id: Number(id)
            }
        })

        prisma.$disconnect()
        return res.status(200).json(result)
    } catch (error) {
        console.error("Ha ocurrido un error al obtener la cuenta: ", error);
        var messageError = "Ha ocurrido un error al obtener la cuenta, intente más tarde";
        return res.status(500).json({ data: [], error: messageError });
    }
}