function isValidPriceItem(item) {
    return (
        item !== null &&
        typeof item === 'object' &&
        typeof item.symbol === 'string' &&
        item.symbol.length > 0 &&
        typeof item.price === 'string' &&
        item.price.length > 0
    );
}

function isValidPriceResponse(data) {
    if (!Array.isArray(data)) return false;
    if (data.length === 0) return false;
    const sample = data.slice(0, 5);
    return sample.every(isValidPriceItem);
}

module.exports = { isValidPriceItem, isValidPriceResponse };
