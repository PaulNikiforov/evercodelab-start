const path = require('path');

const config = {
    appName: 'evercodelab_start',
    env: process.env.NODE_ENV || 'development',
	isDev: (process.env.NODE_ENV || 'development') === 'development',
	dbPath: path.join(__dirname, '..', '..', 'data', 'app.db'),
};

module.exports = config;