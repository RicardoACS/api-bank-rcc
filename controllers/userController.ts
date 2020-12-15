import { sendEmailCreateUser } from './emailController';
import { Request as Req, Response as Res } from 'express'
import { PrismaClient } from "@prisma/client"
const bcrypt = require('bcrypt');
const prisma = new PrismaClient()

export const createUser = async (req: Req, res: Res) => {
    try {
        console.log("[Controller] Se creará un usuario");
        const { rut, name, email, password } = req.body;

    
        //Buscará si existe el usuario en la DB
        const searchUser = await prisma.user.findFirst({
            where: { rut: rut }
        })

        if (searchUser) {
            res.status(409).json({ data: [], error: "Usuario ya se encuentra en el sistema" })
        }

        const hash = await bcrypt.hash(password, 10)
        //Creará el usuario, ya que no está creado.
        const createdUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hash,
                rut,
                created: new Date
            }
        })

        //Una vez que se haya creado el usuario, se crea la cuenta.
        const createdAccount = await prisma.account.create({
            data: {
                ammount: 0,
                number: (Math.round(Math.random() * 10000000)).toString(),
                user: {
                    connect: {
                        user_id: createdUser.user_id
                    }
                }
            }
        })

        const user = await prisma.user.findFirst({
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
        })

        sendEmailCreateUser(user?.name, user?.email);
        prisma.$disconnect()
        res.status(200).json(user)
    } catch (error) {
        console.error("Ha ocurrido un error al crear el usuario: ", error);
        var messageError = "Ha ocurrido un error al crear el usuario, intente más tarde";
        res.status(500).json({ data: [], error: messageError });
    }
}

export const getUserByRut = async (req: Req, res: Res) => {
    try {
        console.log("[Controller] Se buscará un usuario por RUT");
        var { rut } = req.params;

        const result = await prisma.user.findFirst({
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
        })

        prisma.$disconnect()
        res.status(200).json(result)
    } catch (error) {
        console.error("Ha ocurrido un error al buscar el usuario: ", error);
        var messageError = "Ha ocurrido un error al buscar el usuario, intente más tarde";
        res.status(500).json({ data: [], error: messageError })
    }
}

export const login = async (req: Req, res: Res) => {
    try {
        console.log("[Controller] Se Logeará un usuario");
        var { rut, password } = req.body;

        const loginUser = await prisma.user.findFirst({
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
        })

        if (loginUser == null) {
            return res.status(404).json({ data: [], error: "Credenciales invalidas" })
        }

        const compare = await bcrypt.compare(password, loginUser?.password);

        if(!compare) {
            return res.status(404).json({ data: [], error: "Credenciales invalidas" })
        }

        prisma.$disconnect()
        return res.status(200).json(loginUser)
    } catch (error) {
        console.error("Ha ocurrido un error al ingresar al sistema: ", error);
        var messageError = "Ha ocurrido un error al sistema, intente más tarde";
        return res.status(500).json({ data: [], error: messageError });
    }
}


