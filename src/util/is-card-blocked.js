'use strict';

const { CARD_STATUS } = require('../constants');

module.exports = {
  isCardBlocked: card => card.status === CARD_STATUS.BLOCKED,
}
