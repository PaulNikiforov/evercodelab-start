process.env.AUTH_TOKEN = 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2';

const request = require('supertest');
const app = require('../src/app');
const store = require('../src/store/currencyRepository');

const TOKEN = process.env.AUTH_TOKEN;
const auth = () => ({ Authorization: `Bearer ${TOKEN}` });

beforeEach(() => {
    store.reset();
});

describe('POST /currencies', () => {
    it('создаёт валюту и возвращает 201', async () => {
        const res = await request(app)
            .post('/currencies')
            .set(auth())
            .send({ name: 'Bitcoin', ticker: 'BTC' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ id: 1, name: 'Bitcoin', ticker: 'BTC' });
    });

    it('возвращает 400 без name', async () => {
        const res = await request(app)
            .post('/currencies')
            .set(auth())
            .send({ ticker: 'BTC' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBeDefined();
    });
});

describe('GET /currencies', () => {
    it('возвращает пустой массив', async () => {
        const res = await request(app)
            .get('/currencies')
            .set(auth());

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('возвращает созданные валюты', async () => {
        store.create({ name: 'Bitcoin', ticker: 'BTC' });

        const res = await request(app)
            .get('/currencies')
            .set(auth());

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toEqual({ id: 1, name: 'Bitcoin', ticker: 'BTC' });
    });
});

describe('GET /currencies/:id', () => {
    it('возвращает валюту по id', async () => {
        store.create({ name: 'Bitcoin', ticker: 'BTC' });

        const res = await request(app)
            .get('/currencies/1')
            .set(auth());

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ id: 1, name: 'Bitcoin', ticker: 'BTC' });
    });

    it('возвращает 404 для несуществующей валюты', async () => {
        const res = await request(app)
            .get('/currencies/999')
            .set(auth());

        expect(res.statusCode).toBe(404);
    });
});

describe('PUT /currencies/:id', () => {
    it('обновляет валюту', async () => {
        store.create({ name: 'Bitcoin', ticker: 'BTC' });

        const res = await request(app)
            .put('/currencies/1')
            .set(auth())
            .send({ name: 'Ethereum', ticker: 'ETH' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ id: 1, name: 'Ethereum', ticker: 'ETH' });
    });

    it('возвращает 404 для несуществующей валюты', async () => {
        const res = await request(app)
            .put('/currencies/999')
            .set(auth())
            .send({ name: 'Ethereum', ticker: 'ETH' });

        expect(res.statusCode).toBe(404);
    });
});

describe('DELETE /currencies/:id', () => {
    it('удаляет валюту и возвращает 204', async () => {
        store.create({ name: 'Bitcoin', ticker: 'BTC' });

        const res = await request(app)
            .delete('/currencies/1')
            .set(auth());

        expect(res.statusCode).toBe(204);
        expect(res.body).toEqual({});
    });

    it('возвращает 404 для несуществующей валюты', async () => {
        const res = await request(app)
            .delete('/currencies/999')
            .set(auth());

        expect(res.statusCode).toBe(404);
    });
});
