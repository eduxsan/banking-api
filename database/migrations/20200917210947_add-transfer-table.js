'use strict';

exports.up = knex => knex.raw(`
  CREATE TYPE transfer_entity_type AS ENUM('CARD', 'WALLET');

  CREATE TABLE transfer (
    transfer_uuid UUID PRIMARY KEY,
    transfer_date TIMESTAMPTZ NOT NULL,
    amount BIGINT NOT NULL,
    origin_currency_code VARCHAR(3) NOT NULL,
    target_currency_code VARCHAR(3) NOT NULL,
    conversion_fee DECIMAL(5,4),
    origin_entity_uuid UUID NOT NULL,
    origin_entity_type transfer_entity_type NOT NULL,
    target_entity_uuid UUID NOT NULL,
    target_entity_type transfer_entity_type NOT NULL
  );
`);

exports.down = knex => knex.raw(`
  DROP TABLE transfer;
  DROP TYPE transfer_entity_type;
`);
