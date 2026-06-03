const app = require('./app');
const createLogger = require('./logger/logger');
const { initDb } = require('./db/init');

const logger = createLogger();
const PORT = process.env.PORT || 3000;

initDb();

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
