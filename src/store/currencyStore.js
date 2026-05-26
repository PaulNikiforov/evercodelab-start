let currencies = [];
let nextId = 1;

function findAll() {
    return currencies;
}

function findById(id) {
    return currencies.find(c => c.id === id) || null;
}

function findByTicker(ticker) {
    return currencies.find(c => c.ticker.toUpperCase() === ticker.toUpperCase()) || null;
}

function create({ name, ticker }) {
    const currency = { id: nextId++, name, ticker };
    currencies.push(currency);
    return currency;
}

function update(id, { name, ticker }) {
    const currency = findById(id);
    if (!currency) return null;
    currency.name = name;
    currency.ticker = ticker;
    return currency;
}

function remove(id) {
    const index = currencies.findIndex(c => c.id === id);
    if (index === -1) return false;
    currencies.splice(index, 1);
    return true;
}

function reset() {
    currencies = [];
    nextId = 1;
}

module.exports = { findAll, findById, findByTicker, create, update, remove, reset };
