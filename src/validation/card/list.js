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
      cardUuid: Joi.string().uuid().required(),
      walletUuid: Joi.string().uuid().required(),
      // I'm not validating the precise output in cases like the currency, as we could have
      // cases where "valid" currencies are not the ones that were valid N months/years ago.
      // The input validation done for currencies, for instance, is for the input only
      // (e.g. the ones that are valid for new insertions/updated).
      // Outputs may be more diverse, so validation is more about the general structure rather
      // than the actual data correctness.
      currencyCode: Joi.string().required(),
      balance: Joi.number().integer().positive().allow(0).required(),
      number: Joi.string().required(),
      expirationDate: Joi.date().required(),
      ccv: Joi.string().length(3).required(),
      userUuid: Joi.string().uuid().required(),
      status: Joi.string().required(),
    }),
  ).required(),
}
