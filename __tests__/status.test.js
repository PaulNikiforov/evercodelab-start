const request = require('supertest');
const app = require('../src/app');

describe('GET /status', () => {
  it('возвращает статус 200 и строку "ok"', async () => {
    const res = await request(app).get('/status');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('ok');
  });
});
