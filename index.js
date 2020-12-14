//Carga Express
const express = require('express')

const userRoute = require('./app/routes/userRoutes');
const accountRoute = require('./app/routes/accountRoutes');
const transactionRoute = require('./app/routes/transactionRoutes');
const app = express();
const port = 3000;

app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/v1', userRoute);
app.use('/v1', accountRoute);
app.use('/v1', transactionRoute);

app.listen(port, () => {
  console.log("Servidor funcionando en el puerto: ", port );
});
