'use strict';

const { CARD_STATUS } = require('../../constants');
const knex = require('../../knex');

module.exports = {
  blockCard: ({ cardUuid }) => knex.raw(
    `
    UPDATE card
    SET
      balance = 0,
      status = :blockedStatus
    WHERE card_uuid = :cardUuid
    `,
    {
      blockedStatus: CARD_STATUS.BLOCKED,
      cardUuid,
    },
  ),
}
