'use strict';

const { database: { engine, connection} } = require('config');
const knex = require('knex');

module.exports = knex({
  client: engine,
  connection,
})
