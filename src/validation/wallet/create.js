'use strict';

const { currencies } = require('config');
const Joi = require('joi');

const { HEADERS } = require('../../constants');

module.exports = {
  requestSchema: {
    headers: Joi.object({
      [HEADERS.COMPANY_IDENTIFIER]: Joi.string().uuid().required(),
    }),
    payload: Joi.object({
      currencyCode: Joi.string().length(3).valid(...currencies).required(),
      balance: Joi.number().integer().positive().allow(0).required(),
    }),
    options: {
      allowUnknown: true,
    },
  },
  responseSchema: Joi.object({
    walletUuid: Joi.string().uuid().required(),
  }),
};
