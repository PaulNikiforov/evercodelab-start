const createLogger = require('../src/logger/logger');
const validateTaskParams = require('../src/utils/validateTaskParams');

test('логгер добавляет requestId в вывод, если передан', () => {
    const logger = createLogger({ requestId: 'req-42' });
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.info('hello');

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[req-42]'));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('hello'));
    spy.mockRestore();
});

test('validateTaskParams бросает TypeError при невалидных аргументах', () => {
    expect(() => validateTaskParams('', 1000, () => {})).toThrow(TypeError);
    expect(() => validateTaskParams('task', -1, () => {})).toThrow(TypeError);
    expect(() => validateTaskParams('task', 1000, null)).toThrow(TypeError);
    expect(() => validateTaskParams('task', 1000, () => {})).not.toThrow();
});
