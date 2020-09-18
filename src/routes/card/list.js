'use strict';

const handler = require('../../handlers/card/list');
const { requestSchema, responseSchema } = require('../../validation/card/list');

module.exports = {
  method: 'GET',
  path: '/cards',
  options: {
    tags: ['api'],
    validate: requestSchema,
    description: 'Gets all the cards for a given user',
    response: {
      schema: responseSchema,
    },
  },
  handler, 
}

