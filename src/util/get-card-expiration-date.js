'use strict';

const add = require('date-fns/add');

module.exports = {
  getCardExpirationDate: (relativeDate) => add(relativeDate, { months: 1 }),
}
