'use strict';

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
      throw new Error('No master wallet found with the provided currency');
    }

    return formatWalletOutput(walletInformation);
  },
}
