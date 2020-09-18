'use strict';

const { HEADERS } = require('../../constants');
const knex = require('../../knex');
const { formatCardOutput } = require('../../util/format-card-output');

module.exports = async ({ headers: {[HEADERS.USER_IDENTIFIER]: userId } }, h) => {
  // Assuming that we list all the cards, even the blocked ones.
  return knex
    .raw('SELECT * FROM card WHERE user_uuid = :userUuid', { userUuid: userId})
    .then(result => h.response(result.rows.map(formatCardOutput)).code(200))
};
