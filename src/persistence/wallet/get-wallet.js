'use strict';

const Boom = require('@hapi/boom');
const get = require('lodash/get');

const knex = require('../../knex');
const { formatWalletOutput } = require('../../util/formatters/format-wallet-output');

module.exports = {
  getMasterWallet: async ({ currencyCode }) => {
    const result = await knex.raw(
      `
        SELECT * FROM wallet
        WHERE is_master_wallet is true
        AND currency_code = :currencyCode
      `,
      {
        currencyCode,
      },
    );

    const walletInformation = get(result, 'rows[0]');

    if (undefined === walletInformation) {
      throw new Boom.notFound('No master wallet found with the provided currency');
    }

    return formatWalletOutput(walletInformation);
  },
  getWallet: async ({ walletUuid, companyUuid }) => {
    const query = knex
      .select('*')
      .from('wallet')
      .where('wallet_uuid', walletUuid);
    
    if (undefined !== companyUuid) {
      query.andWhere('company_uuid', companyUuid);
    }

    const result = await query;

    if (0 === result.length) {
      throw new Boom.notFound('No wallet found with the provided parameters');
    }

    return formatWalletOutput(result[0]);
  },
}
