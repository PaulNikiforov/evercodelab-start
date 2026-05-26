const fetchWithRetry = require('../src/utils/fetchWithRetry');

describe('fetchWithRetry', () => {
    let fetchSpy;

    beforeEach(() => {
        fetchSpy = jest.spyOn(global, 'fetch');
    });

    afterEach(() => {
        fetchSpy.mockRestore();
    });

    it('возвращает response при успешном запросе с первой попытки', async () => {
        const mockResponse = { ok: true, json: jest.fn() };
        fetchSpy.mockResolvedValue(mockResponse);

        const result = await fetchWithRetry('https://example.com', {
            baseDelayMs: 1,
            maxDelayMs: 4,
            timeoutMs: 1000,
        });

        expect(result).toBe(mockResponse);
        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('повторяет запрос и возвращает response при успехе на второй попытке', async () => {
        const mockResponse = { ok: true, json: jest.fn() };
        fetchSpy
            .mockRejectedValueOnce(new Error('Network error'))
            .mockResolvedValueOnce(mockResponse);

        const result = await fetchWithRetry('https://example.com', {
            baseDelayMs: 1,
            maxDelayMs: 4,
            timeoutMs: 1000,
        });

        expect(result).toBe(mockResponse);
        expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it('бросает последнюю ошибку после исчерпания попыток', async () => {
        fetchSpy.mockRejectedValue(new Error('Persistent error'));

        await expect(
            fetchWithRetry('https://example.com', {
                baseDelayMs: 1,
                maxDelayMs: 4,
                timeoutMs: 100,
            })
        ).rejects.toThrow('Persistent error');

        // baseDelay=1, maxDelay=4 → попытки с задержками: 1, 2, 4, потом 8>4 → стоп
        expect(fetchSpy.mock.calls.length).toBeGreaterThanOrEqual(3);
    });

    it('повторяет при HTTP-ошибке', async () => {
        const mockResponse = { ok: true, json: jest.fn() };
        fetchSpy
            .mockResolvedValueOnce({ ok: false, status: 503 })
            .mockResolvedValueOnce(mockResponse);

        const result = await fetchWithRetry('https://example.com', {
            baseDelayMs: 1,
            maxDelayMs: 4,
            timeoutMs: 1000,
        });

        expect(result).toBe(mockResponse);
        expect(fetchSpy).toHaveBeenCalledTimes(2);
    });
});
