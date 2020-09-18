'use strict';

const Boom = require('@hapi/boom');
const get = require('lodash/get');

const { HEADERS, CARD_STATUS } = require('../../constants');
const knex = require('../../knex');
const { formatCardOutput } = require('../../util/formatters/format-card-output');
const { formatWalletOutput } = require('../../util/formatters/format-wallet-output');
const { isCardBlocked } = require('../../util/is-card-blocked');

module.exports = async (
  {
    headers: {[HEADERS.COMPANY_IDENTIFIER]: companyId, [HEADERS.USER_IDENTIFIER]: userId },
    payload: { cardUuid },
  },
  h,
) => {
  // Retrieving the card & its associated wallet to match the request user/company combination
  // and assess the load operation feasibility.
  const cardAndWalletInformation = await knex.raw(
    `
      SELECT c.*, w.balance as wallet_balance
      FROM card c
      JOIN wallet w USING (wallet_uuid)
      WHERE c.card_uuid = :cardUuid
      AND c.user_uuid = :userUuid
      AND w.company_uuid = :companyUuid
    `,
    {
      cardUuid,
      userUuid: userId,
      companyUuid: companyId,
    },
  );

  const {
    wallet_balance: walletBalance,
    ...cardInformation
  } = get(cardAndWalletInformation, 'rows[0]');

  if (undefined === cardInformation) {
    throw Boom.notFound('Could not find any card associated to given parameters');
  }

  const card = formatCardOutput(cardInformation);
  const wallet = formatWalletOutput({ balance: walletBalance });

  if (isCardBlocked(card)) {
    throw Boom.badRequest('Given card is already blocked');
  }

  await knex.transaction(async (trx) => {
    await knex.raw(
      'UPDATE card SET balance = 0, status = :blockedStatus WHERE card_uuid = :cardUuid',
      {
        blockedStatus: CARD_STATUS.BLOCKED,
        cardUuid,
      },
    ).transacting(trx);

    // We update 
    if (0 < card.balance) {
      console.log(card.walletUuid);
      await knex.raw(
        'UPDATE wallet SET balance = :newWalletBalance WHERE wallet_uuid = :walletUuid',
        {
          newWalletBalance: parseInt(wallet.balance, 10) + card.balance,
          walletUuid: card.walletUuid,
        },
      );
    }
  });

  return h.response({ cardUuid }).code(200);
};
