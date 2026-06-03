const { getDb } = require('../db/database');
const ValidationError = require('../errors/ValidationError');

function findAll() {
    const db = getDb();
    return db.prepare('SELECT * FROM currencies').all();
}

function findById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM currencies WHERE id = ?').get(id) || null;
}

function findByTicker(ticker) {
    const db = getDb();
    return db.prepare('SELECT * FROM currencies WHERE UPPER(ticker) = UPPER(?)').get(ticker) || null;
}

function create({ name, ticker }) {
    const db = getDb();
    try {
        const insert = db.transaction(({ name, ticker }) => {
            const result = db.prepare('INSERT INTO currencies (name, ticker) VALUES (?, ?)').run(name, ticker);
            return { id: Number(result.lastInsertRowid), name, ticker };
        });
        return insert({ name, ticker });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            throw new ValidationError(`Валюта с тикером "${ticker}" уже существует`);
        }
        throw err;
    }
}

function update(id, { name, ticker }) {
    const db = getDb();
    try {
        const updateTx = db.transaction((id, { name, ticker }) => {
            const result = db.prepare('UPDATE currencies SET name = ?, ticker = ? WHERE id = ?').run(name, ticker, id);
            if (result.changes === 0) return null;
            return { id, name, ticker };
        });
        return updateTx(id, { name, ticker });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            throw new ValidationError(`Валюта с тикером "${ticker}" уже существует`);
        }
        throw err;
    }
}

function remove(id) {
    const db = getDb();
    const result = db.prepare('DELETE FROM currencies WHERE id = ?').run(id);
    return result.changes > 0;
}

function reset() {
    const db = getDb();
    db.prepare('DELETE FROM currencies').run();
    db.prepare("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'currencies'").run();
}

module.exports = { findAll, findById, findByTicker, create, update, remove, reset };
