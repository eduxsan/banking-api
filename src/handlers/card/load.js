'use strict';

const Boom = require('@hapi/boom');
const get = require('lodash/get');

const { HEADERS } = require('../../constants');
const knex = require('../../knex');
const { formatCardOutput } = require('../../util/format-card-output');

const isLoadOperationFeasible = ({ wallet, card, amount }) => {
  return 0 <= wallet.balance - amount && 0 <= card.balance + amount;
};

module.exports = async (
  {
    headers: {[HEADERS.COMPANY_IDENTIFIER]: companyId, [HEADERS.USER_IDENTIFIER]: userId },
    payload: { cardUuid, amount },
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

  if (!isLoadOperationFeasible({ wallet: { balance: walletBalance }, card, amount })) {
    throw Boom.badRequest('Load operation is not feasible with the provided amount');
  }

  // The load operation is feasible - we'll perform both the amount changes in a single transaction
  // to ensure an amount consistency between both the card & its associated wallet
  const lol = await knex.transaction(async (trx) => {
    await knex.raw(
      'UPDATE wallet SET balance = :newWalletAmount WHERE wallet_uuid = :walletUuid',
      {
        newWalletAmount: walletBalance - amount,
        walletUuid: card.walletUuid,
      },
    ).transacting(trx);
    await knex.raw(
      'UPDATE card SET balance = :newCardAmount WHERE card_uuid = :cardUuid',
      {
        newCardAmount: card.balance + amount,
        cardUuid: card.cardUuid,
      },
    )
  });

  return h.response({ cardUuid }).code(200);
};
