const { database: { connection } } = require('config');

module.exports = {
  development: {
    client: 'postgresql',
    connection,
    migrations: {
      directory: './database/migrations',
    },
  },
};
