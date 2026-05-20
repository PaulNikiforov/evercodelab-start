const createLogger = require('../logger/logger');
const config = require('../config/config');
const validateTaskParams = require('../utils/validateTaskParams');

const HEARTBEAT_TASK_NAME = 'heartbeat';
const HEARTBEAT_INTERVAL_MS = 10_000;
const HEARTBEAT_MESSAGE = 'running';

const logger = createLogger();

// init
logger.info(`${config.appName}: scheduler.js запущен`);

// scheduler
function scheduleTask(name, interval, task) {
    validateTaskParams(name, interval, task);

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