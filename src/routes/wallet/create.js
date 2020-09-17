'use strict';

const knex = require('../knex');

module.exports = {
  method: 'GET',
  path: '/wallet',
  options: {
    tags: ['api'],
  },
  handler: async () => {
    const r = await knex.raw('SELECT * FROM coucou');

    console.log(r);
    return 'hello world';
  },
}
