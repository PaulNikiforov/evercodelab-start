const AppError = require('./AppError');

class TaskExecutionError extends AppError {
    constructor(message, context = {}) {
        super(message, { statusCode: 500, context });
    }
}

module.exports = TaskExecutionError;
