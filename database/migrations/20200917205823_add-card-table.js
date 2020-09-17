'use strict';

exports.up = knex => knex.raw(`
  CREATE TYPE card_status AS ENUM('ACTIVE', 'BLOCKED');

  CREATE TABLE card (
    card_uuid UUID PRIMARY KEY,
    wallet_uuid UUID NOT NULL,
    balance BIGINT NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    expiration_date TIMESTAMPTZ NOT NULL,
    number VARCHAR(16),
    ccv VARCHAR(3),
    user_uuid UUID NOT NULL,
    status card_status NOT NULL,
    CONSTRAINT fk_card_wallet
      FOREIGN KEY(wallet_uuid)
      REFERENCES wallet(wallet_uuid)
  );
`);

exports.down = knex => knex.raw(`
  DROP TABLE card;
  DROP TYPE card_status;
`);
