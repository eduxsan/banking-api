'use strict';

const handler = require('../../handlers/card/create');
const { requestSchema, responseSchema } = require('../../validation/card/create');

module.exports = {
  method: 'POST',
  path: '/cards',
  options: {
    tags: ['api'],
    validate: requestSchema,
    description: 'Creates a card associated to a wallet',
    response: {
      schema: responseSchema,
    },
  },
  handler, 
}
