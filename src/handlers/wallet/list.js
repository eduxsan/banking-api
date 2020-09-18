'use strict';

const { HEADERS } = require('../../constants');
const knex = require('../../knex');
const { formatWalletOutput } = require('../../util/formatters/format-wallet-output');

module.exports = async ({ headers: {[HEADERS.USER_IDENTIFIER]: userId } }, h) => {
  // I assume that this method is listing wallets for a given USER and not a given company.
  // This has major differences as users are linked to cards and not to wallets.
  // This means that the given user will need to have at least one card associated to a wallet
  // to get it from this method.
  // It probably would have been way easier and relevant if the method was based on the company instead.
  return knex
    .raw(
      `
        SELECT DISTINCT w.* FROM wallet w
        JOIN card c USING (wallet_uuid)
        WHERE c.user_uuid = :userUuid
      `,
      { userUuid: userId},
    )
    .then(result => h.response(result.rows.map(formatWalletOutput)).code(200))
};
