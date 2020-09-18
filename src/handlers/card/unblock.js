'use strict';

const Boom = require('@hapi/boom');

const { HEADERS, CARD_STATUS } = require('../../constants');
const knex = require('../../knex');
const { getCard } = require('../../persistence/card/get-card');
const { isCardBlocked } = require('../../util/is-card-blocked');

module.exports = async (
  {
    headers: {[HEADERS.USER_IDENTIFIER]: userId },
    payload: { cardUuid },
  },
  h,
) => {
  // Retrieving the card info to match the given request parameters
  const card = await getCard({
    cardUuid,
    userUuid: userId,
  });

  if (!isCardBlocked(card)) {
    throw Boom.badRequest('Given card is active already');
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
