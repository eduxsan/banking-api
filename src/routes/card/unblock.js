'use strict';

const handler = require('../../handlers/card/unblock');
const { requestSchema, responseSchema } = require('../../validation/card/unblock');

module.exports = {
  method: 'POST',
  path: '/cards/unblock',
  options: {
    tags: ['api'],
    validate: requestSchema,
    description: 'Unblocks a card',
    response: {
      schema: responseSchema,
    },
  },
  handler, 
}

