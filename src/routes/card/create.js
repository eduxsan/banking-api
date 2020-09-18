'use strict';

const Joi = require('joi');

const handler = require('../../handlers/card/create');
const { HEADERS } = require('../../constants');

const validate = {
  headers: Joi.object({
    [HEADERS.COMPANY_IDENTIFIER]: Joi.string().uuid().required(),
    [HEADERS.USER_IDENTIFIER]: Joi.string().uuid().required(),
  }),
  payload: Joi.object({
    walletUuid: Joi.string().uuid().required(),
  }),
  options: {
    allowUnknown: true,
  },
};

module.exports = {
  method: 'POST',
  path: '/card',
  options: {
    tags: ['api'],
    validate,
    description: 'Creates a card associated to a wallet',
    response: {
      schema: Joi.object({
        cardUuid: Joi.string().uuid().required(),
      }),
    },
  },
  handler, 
}
