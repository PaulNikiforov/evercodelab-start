require('dotenv').config();
const express = require('express');
const authMiddleware = require('./middleware/auth');
const currenciesRouter = require('./routes/currencies');

const app = express();

app.use(express.json());

app.get('/status', (req, res) => {
    res.send('ok');
});

app.use(authMiddleware);
app.use('/currencies', currenciesRouter);

module.exports = app;
