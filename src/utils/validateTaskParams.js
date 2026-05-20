function validateTaskParams(name, interval, task) {
    if (typeof name !== 'string' || !name) {
        throw new TypeError('Аргумент "name" должен быть непустой строкой');
    }
    if (typeof interval !== 'number' || interval <= 0) {
        throw new TypeError('Аргумент "interval" должен быть положительным числом');
    }
    if (typeof task !== 'function') {
        throw new TypeError('Аргумент "task" должен быть функцией');
    }
}

module.exports = validateTaskParams;
