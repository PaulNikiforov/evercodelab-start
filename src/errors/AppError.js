class AppError extends Error {
    constructor(message, { statusCode = 500, context = {} } = {}) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.timestamp = new Date().toISOString();
        this.context = context;
    }
}

module.exports = AppError;
