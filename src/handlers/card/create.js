'use strict';

const Boom = require('@hapi/boom');
const { HEADERS, CARD_STATUS } = require('../../constants');
const get = require('lodash/get');
const { generateCardNumber, generateCcv } = require('../../util/generate-card-number');
const { getCardExpirationDate } = require('../../util/get-card-expiration-date');
const knex = require('../../knex');
const { v4: uuidv4 } = require('uuid');

module.exports = async (
  {
    payload: { walletUuid },
    headers: { [HEADERS.COMPANY_IDENTIFIER]: companyId, [HEADERS.USER_IDENTIFIER]: userId },
  },
  h,
) => {
  // Retrieving the related wallet & matching it to given parameters
  const walletResult = await knex.raw(
    'SELECT * FROM wallet WHERE wallet_uuid = :walletUuid LIMIT 1',
    { walletUuid },
  );
  const wallet = get(walletResult, 'rows[0]');

  // Considering that having a wrong company uuid is a mismatch leading to no known wallet
  if (undefined === wallet || wallet.company_uuid !== companyId) {
    throw Boom.notFound('Could not find any wallet associated to given parameters');
  }

  // Creating the card with random identifiers & numbers 
  const cardUuid = uuidv4();
  const cardNumber = generateCardNumber();
  const ccv = generateCcv();

  await knex.raw(`
      INSERT INTO card (
        card_uuid,
        wallet_uuid,
        currency_code,
        balance,
        number,
        expiration_date,
        ccv,
        user_uuid,
        status
      ) VALUES (
        :cardUuid,
        :walletUuid,
        :currencyCode,
        :balance,
        :number,
        :expirationDate,
        :ccv,
        :userUuid,
        :status
      );
    `, {
    cardUuid,
    walletUuid: wallet.wallet_uuid,
    currencyCode: wallet.currency_code,
    balance: 0, // By default, assuming that a new card has no money on it
    number: cardNumber,
    expirationDate: getCardExpirationDate(new Date()),
    ccv,
    userUuid: userId,
    status: CARD_STATUS.ACTIVE, // Cards are active by default
  });

  return h.response({ cardUuid }).code(201);
};
