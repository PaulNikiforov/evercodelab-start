process.env.AUTH_TOKEN = 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2';

jest.mock('../src/db/database', () => {
    const Database = require('better-sqlite3');
    const db = new Database(':memory:');
    db.pragma('foreign_keys = ON');
    db.exec(`
        CREATE TABLE IF NOT EXISTS currencies (
            id     INTEGER PRIMARY KEY AUTOINCREMENT,
            name   TEXT NOT NULL,
            ticker TEXT NOT NULL UNIQUE
        )
    `);
    return { getDb: () => db, closeDb: () => {} };
});

jest.mock('../src/services/priceService', () => {
    const actual = jest.requireActual('../src/services/priceService');
    return {
        ...actual,
        fetchPrices: jest.fn(),
    };
});

const request = require('supertest');
const app = require('../src/app');
const store = require('../src/store/currencyRepository');
const priceService = require('../src/services/priceService');

const TOKEN = process.env.AUTH_TOKEN;
const auth = () => ({ Authorization: `Bearer ${TOKEN}` });

const mockPrices = [
    { symbol: 'BTCUSDT', price: '43000.000000' },
    { symbol: 'ETHBTC', price: '0.054200' },
    { symbol: 'ETHUSDT', price: '2300.000000' },
];

beforeEach(() => {
    store.reset();
    store.create({ name: 'Bitcoin', ticker: 'BTC' });
    store.create({ name: 'Ethereum', ticker: 'ETH' });
    priceService.fetchPrices.mockResolvedValue(mockPrices);
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('GET /price', () => {
    it('возвращает 401 без авторизации', async () => {
        const res = await request(app)
            .get('/price?currency=BTC');

        expect(res.statusCode).toBe(401);
    });

    it('возвращает 400 без параметра currency', async () => {
        const res = await request(app)
            .get('/price')
            .set(auth());

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it('возвращает 404 для несуществующего ticker', async () => {
        const res = await request(app)
            .get('/price?currency=XYZ')
            .set(auth());

        expect(res.statusCode).toBe(404);
    });

    it('возвращает отфильтрованные курсы', async () => {
        const res = await request(app)
            .get('/price?currency=BTC')
            .set(auth());

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([
            { symbol: 'BTCUSDT', price: '43000.000000' },
            { symbol: 'ETHBTC', price: '0.054200' },
        ]);
    });

    it('возвращает 502 при ошибке Binance API', async () => {
        priceService.fetchPrices.mockRejectedValue(new Error('Network error'));

        const res = await request(app)
            .get('/price?currency=BTC')
            .set(auth());

        expect(res.statusCode).toBe(502);
        expect(res.body.error).toBeDefined();
    });

    it('возвращает 502 при таймауте Binance API', async () => {
        priceService.fetchPrices.mockRejectedValue(new Error('The operation was aborted'));

        const res = await request(app)
            .get('/price?currency=BTC')
            .set(auth());

        expect(res.statusCode).toBe(502);
    });

    it('возвращает 502 при некорректном формате ответа', async () => {
        priceService.fetchPrices.mockRejectedValue(
            new Error('Некорректный формат ответа Binance')
        );

        const res = await request(app)
            .get('/price?currency=BTC')
            .set(auth());

        expect(res.statusCode).toBe(502);
    });
});
