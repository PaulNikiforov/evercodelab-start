const express = require('express');
const router = express.Router();
const createLogger = require('../logger/logger');
const store = require('../store/currencyStore');
const priceService = require('../services/priceService');

const logger = createLogger();

router.get('/', async (req, res) => {
    const { currency } = req.query;

    if (!currency) {
        return res.status(400).json({ error: 'Параметр "currency" обязателен' });
    }

    const found = store.findByTicker(currency);
    if (!found) {
        return res.status(404).json({ error: `Валюта "${currency}" не найдена в хранилище` });
    }

    try {
        const prices = await priceService.fetchPrices();
        const filtered = priceService.filterByCurrency(prices, currency);
        res.json(filtered);
    } catch (error) {
        logger.error(`Binance API: ${error.message}`);
        res.status(502).json({ error: `Ошибка при получении данных: ${error.message}` });
    }
});

module.exports = router;
