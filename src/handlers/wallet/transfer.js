'use strict';

const Boom = require('@hapi/boom');

const { HEADERS } = require('../../constants');
const knex = require('../../knex');
const { getMasterWallet, getWallet } = require('../../persistence/wallet/get-wallet');
const { updateWalletBalance } = require('../../persistence/wallet/update-wallet-balance');
const { isWalletTransferAffordable } = require('../../util/is-wallet-transfer-affordable');
const { computeWalletBalances } = require('../../util/compute-wallet-balances');

module.exports = async (
  {
    payload: { originWalletUuid, targetWalletUuid, amount },
    headers: { [HEADERS.COMPANY_IDENTIFIER]: companyId },
  },
  h,
) => {
  const originWallet = await getWallet({
    companyUuid: companyId,
    walletUuid: originWalletUuid,
  });

  if (!isWalletTransferAffordable({ wallet: originWallet, amount })) {
    throw Boom.badRequest('Transfer is not affordable');
  }

  const targetWallet = await getWallet({ walletUuid: targetWalletUuid });

  const masterWallet = await getMasterWallet({ currencyCode: targetWallet.currencyCode });

  const {
    newOriginWalletBalance,
    newTargetWalletBalance,
    companyFeeAmount,
    newMasterWalletBalance,
  } = await computeWalletBalances({ originWallet, targetWallet, masterWallet, amount });

  await knex.transaction(async (trx) => {
    // Updating the origin wallet balance
    await updateWalletBalance({
      walletUuid: originWalletUuid,
      balance: newOriginWalletBalance,
    }).transacting(trx);

    // Updating the target one
    await updateWalletBalance({
      walletUuid: targetWalletUuid,
      balance: newTargetWalletBalance,
    }).transacting(trx);

    if (undefined !== newMasterWalletBalance) {
      await updateWalletBalance({
        walletUuid: masterWallet.walletUuid,
        balance: newMasterWalletBalance,
      }).transacting(trx);
    }
  });

  return h.response({
    companyFeeAmount,
    newOriginWalletBalance,
    newTargetWalletBalance,
    newMasterWalletBalance,
  }).code(200);
};
