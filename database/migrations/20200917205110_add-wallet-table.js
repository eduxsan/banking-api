'use strict';

exports.up = knex => knex.raw(`
  CREATE TABLE wallet (
    wallet_uuid UUID PRIMARY KEY,
    balance BIGINT NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    company_uuid UUID NOT NULL,
    is_master_wallet BOOLEAN NOT NULL
  );
`);

exports.down = knex => knex.raw(`
  DROP TABLE wallet;
`);
