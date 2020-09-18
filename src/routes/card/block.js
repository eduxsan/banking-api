'use strict';

const handler = require('../../handlers/card/block');
const { requestSchema, responseSchema } = require('../../validation/card/block');

module.exports = {
  method: 'POST',
  path: '/cards/block',
  options: {
    tags: ['api'],
    validate: requestSchema,
    description: 'Blocks a card',
    response: {
      schema: responseSchema,
    },
  },
  handler, 
}

