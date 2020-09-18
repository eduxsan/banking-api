'use strict';

const knex = require('../../knex');

module.exports = {
  updateCardBalance: ({ cardUuid, balance }) => knex.raw(
    `
    UPDATE card
    SET balance = :balance
    WHERE card_uuid = :cardUuid
    `,
    {
      balance,
      cardUuid,
    },
  ),
}
