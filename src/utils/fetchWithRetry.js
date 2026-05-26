const createLogger = require('../logger/logger');

const logger = createLogger();

const DEFAULT_OPTIONS = {
    baseDelayMs: 1000,
    maxDelayMs: 64000,
    timeoutMs: 5000,
};

async function fetchWithRetry(url, options = {}) {
    const { baseDelayMs, maxDelayMs, timeoutMs } = { ...DEFAULT_OPTIONS, ...options };

    let lastError;
    let delay = baseDelayMs;

    while (true) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(url, { signal: controller.signal });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return response;
        } catch (error) {
            lastError = error;
            logger.warn(`Retry ${url}: ${error.message}, следующая попытка через ${delay}мс`);

            if (delay > maxDelayMs) {
                break;
            }

            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        } finally {
            clearTimeout(timeout);
        }
    }

    throw lastError;
}

module.exports = fetchWithRetry;
