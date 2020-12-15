
import express, { Router } from 'express'
import morgan from 'morgan'
import { getAllBanks } from './controllers/bankController'
import { createUser, getUserByRut, login } from './controllers/userController';
import { getAccountById } from './controllers/accountController'
import { createTransaction, createTransferThirdParties, getLastMovements } from './controllers/transactionController';
import { getDestinationByAccountId, createDestination } from './controllers/destinationController';
const app = express()

app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

const router = Router()

// Rutas del Banco
router.get('/v1/banks', getAllBanks)
router.post('/v1/users', createUser)
router.get('/v1/accounts/:id', getAccountById)
router.get('/v1/users/:rut', getUserByRut)
router.post('/v1/users/login', login)
router.post('/v1/transactions', createTransaction)
router.post('/v1/transactions/third-parties', createTransferThirdParties)
router.get('/v1/transactions/:id', getLastMovements)
router.post('/v1/destinations', createDestination)
router.get('/v1/destinations/:id', getDestinationByAccountId)


app.use(router)

app.listen(process.env.PORT, () => console.log('Servidor funcionando en el puerto ${process.env.PORT}'))