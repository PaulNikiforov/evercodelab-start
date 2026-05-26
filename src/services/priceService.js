const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price';
const BINANCE_TIMEOUT_MS = 5000;

async function fetchPrices() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), BINANCE_TIMEOUT_MS);
    try {
        const response = await fetch(BINANCE_API_URL, { signal: controller.signal });
        if (!response.ok) {
            throw new Error(`Binance API error: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('Некорректный формат ответа Binance');
        }
        return data;
    } finally {
        clearTimeout(timeout);
    }
}

function filterByCurrency(prices, ticker) {
    return prices.filter(p => p.symbol.includes(ticker.toUpperCase()));
}

module.exports = { fetchPrices, filterByCurrency };
