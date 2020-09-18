'use strict';

const { HEADERS } = require('../../constants');
const { getUserCards } = require('../../persistence/card/get-card');

// Assuming that we list all the cards, even the blocked ones.
module.exports = (
  { headers: {[HEADERS.USER_IDENTIFIER]: userId } },
  h,
) => getUserCards({ userUuid: userId }).then(cards => h.response(cards).code(200)); 
