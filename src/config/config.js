const config = {
    appName: 'evercodelab_start',
    env: process.env.NODE_ENV || 'development',
	isDev: (process.env.NODE_ENV || 'development') === 'development',
};

module.exports = config;