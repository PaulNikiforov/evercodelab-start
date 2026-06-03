const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const createLogger = require('../logger/logger');

const logger = createLogger({});

let db = null;

function getDb() {
    if (db) return db;

    const dir = path.dirname(config.dbPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(config.dbPath);
    db.pragma('foreign_keys = ON');

    return db;
}

function closeDb() {
    if (!db) return;
    db.close();
    db = null;
    logger.info('Соединение с базой данных закрыто');
}

module.exports = { getDb, closeDb };
