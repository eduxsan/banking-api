'use strict';

const handler = require('../../handlers/wallet/create');
const { requestSchema, responseSchema } = require('../../validation/wallet/create');

module.exports = {
  method: 'POST',
  path: '/wallets',
  options: {
    tags: ['api'],
    validate: requestSchema,
    description: 'Creates a wallet',
    response: {
      schema: responseSchema,
    },
  },
  handler,
}
