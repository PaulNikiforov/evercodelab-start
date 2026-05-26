const fetchWithRetry = require('../utils/fetchWithRetry');
const { isValidPriceResponse } = require('../validators/binanceValidator');

const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price';

async function fetchPrices() {
    const response = await fetchWithRetry(BINANCE_API_URL, {
        baseDelayMs: 1000,
        maxDelayMs: 64000,
        timeoutMs: 5000,
    });

    const data = await response.json();

    if (!isValidPriceResponse(data)) {
        throw new Error('Некорректный формат ответа Binance');
    }

    return data;
}

function filterByCurrency(prices, ticker) {
    return prices.filter(p => p.symbol.includes(ticker.toUpperCase()));
}

module.exports = { fetchPrices, filterByCurrency };
