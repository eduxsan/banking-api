'use strict';

const Boom = require('@hapi/boom');
const { transfer: { fee } } = require('config');
const get = require('lodash/get');

const currencyConverter = require('../../money/currency-converter');
const { HEADERS } = require('../../constants');
const knex = require('../../knex');
const { getMasterWallet } = require('../../persistence/wallet/get-master-wallet');
const { formatWalletOutput } = require('../../util/formatters/format-wallet-output');
const { isWalletTransferAffordable } = require('../../util/is-wallet-transfer-affordable');

module.exports = async (
  {
    payload: { originWalletUuid, targetWalletUuid, amount },
    headers: { [HEADERS.COMPANY_IDENTIFIER]: companyId },
  },
  h,
) => {
  const originWalletQueryResult = await knex.raw(
    `
      SELECT * FROM wallet
      WHERE company_uuid = :companyUuid
      AND wallet_uuid  = :originWalletUuid
    `,
    {
      companyUuid: companyId,
      originWalletUuid,
    },
  );

  const originWalletInformation = get(originWalletQueryResult, 'rows[0]');

  if (undefined === originWalletInformation) {
    throw Boom.notFound('Could not find any wallet associated to given parameters');
  }

  const originWallet = formatWalletOutput(originWalletInformation);

  if (!isWalletTransferAffordable({ wallet: originWallet, amount })) {
    throw Boom.badRequest('Transfer is not affordable');
  }

  // Getting target wallet
  const targetWalletQueryResult = await knex.raw(
    `
      SELECT * FROM wallet
      WHERE company_uuid = :companyUuid
      AND wallet_uuid  = :targetWalletUuid
    `,
    {
      companyUuid: companyId,
      targetWalletUuid,
    },
  );

  const targetWalletInformation = get(targetWalletQueryResult, 'rows[0]');

  if (undefined === targetWalletInformation) {
    throw Boom.notFound('Could not find any wallet associated to given parameters');
  }

  const targetWallet = formatWalletOutput(targetWalletInformation);

  let effectiveOriginWalletAmount = originWallet.balance - amount;
  // May be redefined if the currency is different from both wallets
  let companyFeeAmount = 0;
  let effectiveTargetWalletAmount = targetWallet + amount;
  let effectiveMasterWalletAmount;
  let masterWallet;

  if (targetWallet.currencyCode !== originWallet.currencyCode) {
    // We'll convert the amount, and get 2,9% of fees from this converted amount.
    const convertedAmount = await currencyConverter.convertAmount({
      amount,
      originCurrency: originWallet.currencyCode,
      targetCurrency: targetWallet.currencyCode,
    });

    // Calculating the fees to transfer to the company's wallet and thus the rest going to the
    // target wallet.
    companyFeeAmount = Math.floor(convertedAmount * fee);
    effectiveTargetWalletAmount = targetWallet.balance + (convertedAmount - companyFeeAmount);

    masterWallet = await getMasterWallet({ currencyCode: targetWallet.currencyCode });
    effectiveMasterWalletAmount = masterWallet.balance + companyFeeAmount;

  }

  // Performing the transfer transaction.
  await knex.transaction(async (trx) => {
    // Updating the origin wallet balance
    await knex.raw(
      'UPDATE wallet SET balance = :effectiveOriginWalletAmount WHERE wallet_uuid = :originWalletUuid',
      {
        effectiveOriginWalletAmount,
        originWalletUuid,
      },
    ).transacting(trx);
    // Updating the target one
    await knex.raw(
      'UPDATE wallet SET balance = :effectiveTargetWalletAmount WHERE wallet_uuid = :targetWalletUuid',
      {
        effectiveTargetWalletAmount,
        targetWalletUuid,
      },
    ).transacting(trx);
    if (undefined !== effectiveMasterWalletAmount && undefined !== masterWallet) {
      // Updating the master wallet with the calculated fees
      await knex.raw(
        'UPDATE wallet SET balance = :effectiveMasterWalletAmount WHERE wallet_uuid = :masterWalletUuid',
        {
          effectiveMasterWalletAmount,
          masterWalletUuid: masterWallet.walletUuid,
        },
      ).transacting(trx);
    }
  });

  return h.response({
    companyFeeAmount,
    effectiveOriginWalletAmount,
    effectiveTargetWalletAmount,
    effectiveMasterWalletAmount,
  }).code(200);
};
