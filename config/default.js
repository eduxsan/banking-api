'use strict';

module.exports = {
  server: {
    host: '0.0.0.0',
    port: 4321,
  },
  swagger: {
    // Exposing this config in the config file as we'd probably not want an UI in prod for instance
    documentationPage: true, 
  },
};
