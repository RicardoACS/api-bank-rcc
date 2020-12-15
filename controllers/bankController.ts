import { Request as Req, Response as Res } from 'express'
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const getAllBanks = async (req: Req, res: Res) => {
    try {
        console.log("[Controller] Listará todos los bancos");
        const bank = await prisma.bank.findMany()
    
        prisma.$disconnect()
        return res.status(200).json(bank)
    } catch (error) {
        console.error("Ha ocurrido un error al obtener los bancos: ", error);
        var messageError = "Ha ocurrido un error al obtener los bancos, intente más tarde";
        return res.status(500).json({data: [], error: messageError});
    }
}