const AppError = require('./AppError');

class ValidationError extends AppError {
    constructor(message, context = {}) {
        super(message, { statusCode: 400, context });
    }
}

module.exports = ValidationError;
