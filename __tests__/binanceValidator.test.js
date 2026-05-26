const { isValidPriceItem, isValidPriceResponse } = require('../src/validators/binanceValidator');

describe('binanceValidator', () => {
    describe('isValidPriceItem', () => {
        it('принимает корректный элемент', () => {
            expect(isValidPriceItem({ symbol: 'BTCUSDT', price: '43000.00' })).toBe(true);
        });

        it('отклоняет null', () => {
            expect(isValidPriceItem(null)).toBe(false);
        });

        it('отклоняет элемент без symbol', () => {
            expect(isValidPriceItem({ price: '43000.00' })).toBe(false);
        });

        it('отклоняет элемент без price', () => {
            expect(isValidPriceItem({ symbol: 'BTCUSDT' })).toBe(false);
        });

        it('отклоняет пустой symbol', () => {
            expect(isValidPriceItem({ symbol: '', price: '100' })).toBe(false);
        });

        it('отклоняет числовой price', () => {
            expect(isValidPriceItem({ symbol: 'BTCUSDT', price: 43000 })).toBe(false);
        });
    });

    describe('isValidPriceResponse', () => {
        it('принимает массив корректных элементов', () => {
            const data = [
                { symbol: 'BTCUSDT', price: '43000.00' },
                { symbol: 'ETHUSDT', price: '2300.00' },
            ];
            expect(isValidPriceResponse(data)).toBe(true);
        });

        it('отклоняет не массив', () => {
            expect(isValidPriceResponse({ error: 'oops' })).toBe(false);
            expect(isValidPriceResponse('string')).toBe(false);
            expect(isValidPriceResponse(null)).toBe(false);
        });

        it('отклоняет пустой массив', () => {
            expect(isValidPriceResponse([])).toBe(false);
        });

        it('отклоняет массив с некорректными элементами', () => {
            expect(isValidPriceResponse([{ foo: 'bar' }])).toBe(false);
        });
    });
});
