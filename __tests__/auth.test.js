process.env.AUTH_TOKEN = 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2';

const request = require('supertest');
const app = require('../src/app');

describe('Authorization middleware', () => {
    it('возвращает 401 без заголовка Authorization', async () => {
        const res = await request(app).get('/protected');
        expect(res.statusCode).toBe(401);
    });

    it('возвращает 403 с неверным токеном', async () => {
        const res = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer wrong-token');
        expect(res.statusCode).toBe(403);
    });

    it('не требует авторизации для /status', async () => {
        const res = await request(app).get('/status');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('ok');
    });
});
