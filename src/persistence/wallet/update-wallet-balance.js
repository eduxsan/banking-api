'use strict';

const knex = require('../../knex');

module.exports = {
  updateWalletBalance: ({ walletUuid, balance }) => knex.raw(
    `
    UPDATE wallet
    SET balance = :balance
    WHERE wallet_uuid = :walletUuid
    `,
    {
      walletUuid,
      balance,
    },
  ),
}
