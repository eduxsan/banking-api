'use strict';

const Joi = require('joi');

const { HEADERS } = require('../../constants');

module.exports = {
  requestSchema: {
    headers: Joi.object({
      [HEADERS.COMPANY_IDENTIFIER]: Joi.string().uuid().required(),
    }),
    payload: Joi.object({
      // Assuming that the transfer is always going from an original wallet
      // owned by the to any other wallet.
      amount: Joi.number().integer().positive(),
      originWalletUuid: Joi.string().uuid().required(),
      targetWalletUuid: Joi.string().uuid().required(),
    }),
    options: {
      allowUnknown: true,
    },
  },
  responseSchema: Joi.object({
    companyFeeAmount: Joi.number().integer().positive().allow(0).required(),
    newOriginWalletBalance: Joi.number().integer().positive().allow(0).required(),
    newTargetWalletBalance: Joi.number().integer().positive().allow(0).required(),
    // Optional as we may not change anything on the master wallet if there is no fee to apply
    newMasterWalletBalance: Joi.number().integer().positive().allow(0),
  }).required(),
}
