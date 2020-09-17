'use strict';

module.exports = {
  database: {
    engine: 'pg',
    connection: {
      host: '127.0.0.1',
      database: 'bank',
      user: 'postgres',
      password: 'postgres',
    },
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
