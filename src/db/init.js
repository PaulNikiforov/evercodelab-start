const { getDb, closeDb } = require('./database');
const createLogger = require('../logger/logger');
const config = require('../config/config');

const logger = createLogger({});

function initDb() {
    logger.info('Инициализация базы данных...');

    const db = getDb();

    db.exec(`
        CREATE TABLE IF NOT EXISTS task_log (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            name      TEXT    NOT NULL,
            executed_at TEXT  NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
            status    TEXT    NOT NULL DEFAULT 'success'
        );

        CREATE TABLE IF NOT EXISTS currencies (
            id     INTEGER PRIMARY KEY AUTOINCREMENT,
            name   TEXT NOT NULL,
            ticker TEXT NOT NULL UNIQUE
        );
    `);

    logger.info('База данных успешно инициализирована: ' + config.dbPath);
    closeDb();
}

initDb();
