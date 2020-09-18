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
      walletUuid: Joi.string().uuid().required(),
    }),
    options: {
      allowUnknown: true,
    },
  },
  responseSchema: Joi.object({
    cardUuid: Joi.string().uuid().required(),
  }),
}
