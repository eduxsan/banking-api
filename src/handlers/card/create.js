'use strict';

const { v4: uuidv4 } = require('uuid');

const { HEADERS, CARD_STATUS } = require('../../constants');
const knex = require('../../knex');
const { getWallet } = require('../../persistence/wallet/get-wallet');
const { generateCardNumber, generateCcv } = require('../../util/generate-card-number');
const { getCardExpirationDate } = require('../../util/get-card-expiration-date');

module.exports = async (
  {
    payload: { walletUuid },
    headers: { [HEADERS.COMPANY_IDENTIFIER]: companyId, [HEADERS.USER_IDENTIFIER]: userId },
  },
  h,
) => {
  // Retrieving the related wallet & matching it to given parameters
  const wallet = await getWallet({
    walletUuid,
    companyUuid: companyId,
  });

  const cardUuid = uuidv4();

  // Creating the card with random identifiers & numbers
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
    walletUuid: wallet.walletUuid,
    currencyCode: wallet.currencyCode,
    balance: 0, // By default, assuming that a new card has no money on it
    number: generateCardNumber(),
    expirationDate: getCardExpirationDate(new Date()),
    ccv: generateCcv(),
    userUuid: userId,
    status: CARD_STATUS.ACTIVE, // Cards are active by default
  });

  return h.response({ cardUuid }).code(201);
};
