'use strict';

module.exports = {
  // Allowed currencies
  currencies: ['USD', 'EUR', 'GBP'],
  transfer: {
    fee: 0.29,
  },
  database: {
    engine: 'pg',
  },
  fixer: {
    baseURL: 'http://data.fixer.io/api/',
    timeout: 1000,
    // Fixer has got some limitations on its basic plan. For this exercise's sake (and only for it)
    // we will fallback to a dummy currency rate if such a limitation happens (for instance with base USD currency).
    // This would of course NEVER to be implemented anywhere - it's only for this exercise's sake.
    fakeCurrencyRate: 1.2,
  },
  server: {
    host: '0.0.0.0',
    port: 4321,
    debug: { request: ['error'] },
  },
  swagger: {
    // Exposing this config in the config file as we'd probably not want an UI in prod for instance
    documentationPage: true, 
  },
};
