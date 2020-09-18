'use strict';

const Boom = require('@hapi/boom');

const knex = require('../../knex');
const { formatCardOutput } = require('../../util/formatters/format-card-output');

module.exports = {
  getCard: async ({ cardUuid, userUuid }) => {
    const query = knex
      .select('*')
      .from('card')
      .where('card_uuid', cardUuid);

    if (undefined !== userUuid) {
      query.andWhere('user_uuid', userUuid);
    }

    const result = await query;

    if (0 === result.length) {
      throw new Boom.notFound('No card found with the provided parameters');
    }

    return formatCardOutput(result[0]);
  },
  getUserCards: ({ userUuid }) => knex.raw(
    'SELECT * FROM card WHERE user_uuid = :userUuid',
    {
      userUuid,
    },
  ).then(result => result.rows.map(formatCardOutput)),
};
