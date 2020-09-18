'use strict';

const Joi = require('joi');

const { HEADERS } = require('../../constants');

module.exports = {
  requestSchema: {
    headers: Joi.object({
      [HEADERS.COMPANY_IDENTIFIER]: Joi.string().uuid().required(),
      [HEADERS.USER_IDENTIFIER]: Joi.string().uuid().required(),
    }),
    payload: Joi.object({
      cardUuid: Joi.string().uuid().required(),
      // This can be either positive or negative as we can also unload a card thanks to this method.
      // We could have had a different way to differenciate both operations but it may be overkill
      // in some cases.
      // We also don't request the currency as we don't handle the currency change for this kind of operation.
      amount: Joi.number().integer().required(),
    }),
    options: {
      allowUnknown: true,
    },
  },
  responseSchema: Joi.object({
    cardUuid: Joi.string().uuid().required(),
  }).required(),
}
