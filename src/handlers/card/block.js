'use strict';

const Boom = require('@hapi/boom');

const { HEADERS } = require('../../constants');
const knex = require('../../knex');
const { blockCard } = require('../../persistence/card/block-card');
const { getCard } = require('../../persistence/card/get-card');
const { getWallet } = require('../../persistence/wallet/get-wallet');
const { updateWalletBalance } = require('../../persistence/wallet/update-wallet-balance');
const { isCardBlocked } = require('../../util/is-card-blocked');

module.exports = async (
  {
    headers: {[HEADERS.COMPANY_IDENTIFIER]: companyId, [HEADERS.USER_IDENTIFIER]: userId },
    payload: { cardUuid },
  },
  h,
) => {
  const card = await getCard({
    cardUuid,
    userUuid: userId,
  });

  const wallet = await getWallet({
    walletUuid: card.walletUuid,
    companyUuid: companyId,
  });

  if (isCardBlocked(card)) {
    throw Boom.badRequest('Given card is blocked already');
  }

  await knex.transaction(async (trx) => {
    await blockCard({ cardUuid }).transacting(trx);

    if (0 < card.balance) {
      await updateWalletBalance({
        balance: wallet.balance + card.balance,
        walletUuid: card.walletUuid,
      }).transacting(trx);
    }
  });

  return h.response({ cardUuid }).code(200);
};
