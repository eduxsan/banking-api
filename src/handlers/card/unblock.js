'use strict';

const Boom = require('@hapi/boom');
const get = require('lodash/get');

const { HEADERS, CARD_STATUS } = require('../../constants');
const knex = require('../../knex');
const { formatCardOutput } = require('../../util/formatters/format-card-output');
const { isCardBlocked } = require('../../util/is-card-blocked');

module.exports = async (
  {
    headers: {[HEADERS.COMPANY_IDENTIFIER]: companyId, [HEADERS.USER_IDENTIFIER]: userId },
    payload: { cardUuid },
  },
  h,
) => {
  // Retrieving the card info to match the given request parameters
  const result = await knex.raw(
    `
      SELECT c.*
      FROM card c
      JOIN wallet w USING (wallet_uuid)
      WHERE c.card_uuid = :cardUuid
      AND c.user_uuid = :userUuid
      AND w.company_uuid = :companyUuid
    `,
    {
      cardUuid,
      userUuid: userId,
      companyUuid: companyId,
    },
  );

  const cardInformation = get(result, 'rows[0]');

  if (undefined === cardInformation) {
    throw Boom.notFound('Could not find any card associated to given parameters');
  }

  const card = formatCardOutput(cardInformation);

  if (!isCardBlocked(card)) {
    throw Boom.badRequest('Given card is already unblocked');
  }

  await knex.raw(
    'UPDATE card SET status = :unBlockedStatus WHERE card_uuid = :cardUuid',
    {
      unBlockedStatus: CARD_STATUS.ACTIVE,
      cardUuid,
    },
  );

  return h.response({ cardUuid }).code(200);
};
