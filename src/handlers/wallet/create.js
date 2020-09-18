'use strict';

const { v4: uuidv4 } = require('uuid');

const knex = require('../../knex');
const { HEADERS } = require('../../constants');

module.exports = async (
  {
    payload: { currencyCode, balance, isMasterWallet },
    headers: { [HEADERS.COMPANY_IDENTIFIER]: companyId },
  },
  h,
) => {
  const walletUuid = uuidv4();

  await knex.raw(`
      INSERT INTO wallet (
        wallet_uuid,
        balance,
        currency_code,
        company_uuid,
        is_master_wallet
      ) VALUES (
        :walletUuid,
        :balance,
        :currencyCode,
        :companyUuid,
        :isMasterWallet
      );
    `, {
    walletUuid,
    balance,
    currencyCode,
    companyUuid: companyId,
    isMasterWallet,
  });

  return h.response({ walletUuid }).code(201);
};
