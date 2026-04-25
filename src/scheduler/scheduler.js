const createLogger = require('../utils/logger');
const config = require('../config/config');

const HEARTBEAT_TASK_NAME = 'heartbeat';
const HEARTBEAT_INTERVAL_MS = 10_000;
const HEARTBEAT_MESSAGE = 'running';

const logger = createLogger();

// init
logger.info(`${config.appName}: scheduler.js запущен`);

// scheduler
function scheduleTask(name, interval, task) {
    if (typeof name !== 'string' || !name) {
        throw new TypeError('Аргумент "name" должен быть непустой строкой');
    }
    if (typeof interval !== 'number' || interval <= 0) {
        throw new TypeError('Аргумент "interval" должен быть положительным числом');
    }
    if (typeof task !== 'function') {
        throw new TypeError('Аргумент "task" должен быть функцией');
    }

    logger.info(`Задача "${name}" зарегистрирована, интервал: ${interval} мс`);

    setInterval(() => {
        try {
            task();
        } catch (error) {
            logger.error(`Задача "${name}": ошибка при выполнении — ${error.message}`);
        }
    }, interval);
}

// register task
try {
    scheduleTask(HEARTBEAT_TASK_NAME, HEARTBEAT_INTERVAL_MS, () => {
        logger.info(HEARTBEAT_MESSAGE);
    });
} catch (error) {
    logger.error(`Не удалось зарегистрировать задачу: ${error.message}`);
}