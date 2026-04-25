const config = require('../config/config');

function createLogger() {
    return {
        info(message) {
            const now = new Date().toISOString();
            console.log(`[${now}] [INFO] [${config.appName}] ${message}`);
        },
        error(message) {
            const now = new Date().toISOString();
            console.error(`[${now}] [ERROR] [${config.appName}] ${message}`);
        },
    };
}

module.exports = createLogger;