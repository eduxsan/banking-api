'use strict';

const { currencies } = require('config');
const Joi = require('joi');

const handler = require('../../handlers/wallet/create');
const { HEADERS } = require('../../constants');

const validate = {
  headers: Joi.object({
    [HEADERS.COMPANY_IDENTIFIER]: Joi.string().uuid().required(),
  }),
  payload: Joi.object({
    currencyCode: Joi.string().length(3).valid(...currencies).required(),
    balance: Joi.number().integer().positive().required(),
  }),
  options: {
    allowUnknown: true,
  },
};

module.exports = {
  method: 'POST',
  path: '/wallet',
  options: {
    tags: ['api'],
    validate,
    description: 'Creates a wallet',
    response: {
      schema: Joi.object({
        walletUuid: Joi.string().uuid().required(),
      }),
    },
  },
  handler,
}
