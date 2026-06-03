const { getDb } = require('../db/database');

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
    const stmt = db.prepare('INSERT INTO currencies (name, ticker) VALUES (?, ?)');
    const result = stmt.run(name, ticker);
    return { id: Number(result.lastInsertRowid), name, ticker };
}

function update(id, { name, ticker }) {
    const db = getDb();
    const stmt = db.prepare('UPDATE currencies SET name = ?, ticker = ? WHERE id = ?');
    const result = stmt.run(name, ticker, id);
    if (result.changes === 0) return null;
    return { id, name, ticker };
}

function remove(id) {
    const db = getDb();
    const stmt = db.prepare('DELETE FROM currencies WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}

function reset() {
    const db = getDb();
    db.prepare('DELETE FROM currencies').run();
}

module.exports = { findAll, findById, findByTicker, create, update, remove, reset };
