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
    // Joi.object({
    //   cardUuid: Joi.string().uuid().required(),
    //   walletUuid: Joi.string().uuid().required(),
    //   currencyCode: Joi.string().required(),
    //   balance: Joi.number().integer().positive().allow(0).required(),
    //   number: Joi.string().required(),
    //   expirationDate: Joi.date().required(),
    //   ccv: Joi.string().length(3).required(),
    //   userUuid: Joi.string().uuid().required(),
    //   status: Joi.string().valid(CARD_STATUS.ACTIVE, CARD_STATUS.BLOCKED),
    // }),
  ).required(),
}
