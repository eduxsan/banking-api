'use strict';

const Joi = require('joi');

const { HEADERS } = require('../../constants');

module.exports = {
  requestSchema: {
    headers: Joi.object({
      [HEADERS.USER_IDENTIFIER]: Joi.string().uuid().required(),
    }),
    options: {
      allowUnknown: true,
    },
  },
  responseSchema: Joi.array().items(
    Joi.object({
      walletUuid: Joi.string().uuid().required(),
      balance: Joi.number().integer().positive().allow(0).required(),
      currencyCode: Joi.string().required(),
      companyUuid: Joi.string().uuid().required(),
      isMasterWallet: Joi.boolean().required(),
    }),
  ).required(),
}
