const express = require('express');
const router = express.Router();
const store = require('../store/currencyRepository');
const ValidationError = require('../errors/ValidationError');

function validateCurrency({ name, ticker }) {
    if (!name || typeof name !== 'string') {
        throw new ValidationError('Поле "name" обязательно и должно быть строкой');
    }
    if (!ticker || typeof ticker !== 'string') {
        throw new ValidationError('Поле "ticker" обязательно и должно быть строкой');
    }
}

router.get('/', (req, res) => {
    res.json(store.findAll());
});

router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'id должен быть числом' });
    const currency = store.findById(id);
    if (!currency) return res.status(404).json({ error: 'Валюта не найдена' });
    res.json(currency);
});

router.post('/', (req, res) => {
    try {
        validateCurrency(req.body);
    } catch (error) {
        return res.status(error.statusCode || 400).json({ error: error.message });
    }
    try {
        const currency = store.create(req.body);
        res.status(201).json(currency);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ error: error.message });
    }
});

router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'id должен быть числом' });
    try {
        validateCurrency(req.body);
    } catch (error) {
        return res.status(error.statusCode || 400).json({ error: error.message });
    }
    try {
        const currency = store.update(id, req.body);
        if (!currency) return res.status(404).json({ error: 'Валюта не найдена' });
        res.json(currency);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ error: error.message });
    }
});

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'id должен быть числом' });
    const removed = store.remove(id);
    if (!removed) return res.status(404).json({ error: 'Валюта не найдена' });
    res.status(204).end();
});

module.exports = router;
