'use strict';

const handler = require('../../handlers/wallet/transfer');
const { requestSchema, responseSchema } = require('../../validation/wallet/transfer');

module.exports = {
  method: 'POST',
  path: '/wallets/transfer',
  options: {
    tags: ['api'],
    validate: requestSchema,
    description: 'Transfers some money from a wallet to another',
    // response: {
    //   schema: responseSchema,
    // },
  },
  handler, 
}

