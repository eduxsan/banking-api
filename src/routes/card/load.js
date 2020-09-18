'use strict';

const handler = require('../../handlers/card/load');
const { requestSchema, responseSchema } = require('../../validation/card/load');

module.exports = {
  method: 'POST',
  path: '/cards/load',
  options: {
    tags: ['api'],
    validate: requestSchema,
    description: '(Un)Loads some money on a given card from the corresponding wallet',
    response: {
      schema: responseSchema,
    },
  },
  handler, 
}

