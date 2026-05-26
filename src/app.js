require('dotenv').config();
const express = require('express');
const authMiddleware = require('./middleware/auth');

const app = express();

app.get('/status', (req, res) => {
  res.send('ok');
});

app.use(authMiddleware);

module.exports = app;
