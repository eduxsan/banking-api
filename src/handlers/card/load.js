'use strict';

const Boom = require('@hapi/boom');

const { HEADERS } = require('../../constants');
const knex = require('../../knex');
const { updateCardBalance } = require('../../persistence/card/update-card-balance');
const { getCard } = require('../../persistence/card/get-card');
const { getWallet } = require('../../persistence/wallet/get-wallet');
const { updateWalletBalance } = require('../../persistence/wallet/update-wallet-balance');
const { isCardBlocked } = require('../../util/is-card-blocked');
const { isLoadOperationFeasible } = require('../../util/is-load-operation-feasible');

module.exports = async (
  {
    headers: {[HEADERS.COMPANY_IDENTIFIER]: companyId, [HEADERS.USER_IDENTIFIER]: userId },
    payload: { cardUuid, amount },
  },
  h,
) => {
  // Retrieving the card & its associated wallet to match the request user/company combination
  // and assess the load operation feasibility.
  const card = await getCard({
    cardUuid,
    userUuid: userId,
  });

  if (isCardBlocked(card)) {
    throw Boom.badRequest('The given card is blocked and thus no load operation is allowed');
  }

  const wallet = await getWallet({
    walletUuid: card.walletUuid,
    companyUuid: companyId,
  });

  if (!isLoadOperationFeasible({ wallet: { balance: wallet.balance }, card, amount })) {
    throw Boom.badRequest('Load operation is not feasible with the provided amount');
  }

  // The load operation is feasible - we'll perform both the amount changes in a single transaction
  // to ensure an amount consistency between both the card & its associated wallet
  await knex.transaction(async (trx) => {
    await updateWalletBalance({
      walletUuid: card.walletUuid,
      balance: wallet.balance - amount,
    }).transacting(trx);

    await updateCardBalance({
      cardUuid: card.cardUuid,
      balance: card.balance + amount,
    }).transacting(trx);
  });

  return h.response({ cardUuid }).code(200);
};
