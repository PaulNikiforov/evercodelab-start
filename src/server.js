const app = require('./app');
const createLogger = require('./logger/logger');

const logger = createLogger();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
