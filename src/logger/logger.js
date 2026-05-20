const config = require('../config/config');

function createLogger({ requestId } = {}) {
    const format = (level, message) => {
        const now = new Date().toISOString();
        const parts = [`[${now}]`, `[${level}]`, `[${config.appName}]`];
        if (requestId) parts.push(`[${requestId}]`);
        parts.push(message);
        return parts.join(' ');
    };

    return {
        error(message) {
            console.error(format('ERROR', message));
        },
        warn(message) {
            console.warn(format('WARN', message));
        },
        info(message) {
            console.log(format('INFO', message));
        },
        debug(message) {
            console.log(format('DEBUG', message));
        },
        trace(message) {
            console.log(format('TRACE', message));
        },
    };
}

module.exports = createLogger;
