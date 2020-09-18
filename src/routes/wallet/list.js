'use strict';

const handler = require('../../handlers/wallet/list');
const { requestSchema, responseSchema } = require('../../validation/wallet/list');

module.exports = {
  method: 'GET',
  path: '/wallets',
  options: {
    tags: ['api'],
    validate: requestSchema,
    description: 'Gets all the wallets for a given user',
    response: {
      schema: responseSchema,
    },
  },
  handler, 
}

