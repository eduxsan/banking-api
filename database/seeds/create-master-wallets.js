'use strict';

exports.seed = (knex) => {
  return knex('wallet').del()
    .then(() => {
      // Assuming that all master wallets would have the same company ID
      return knex('wallet').insert([
        {
          wallet_uuid: 'aaa54d7a-e4fe-47af-8ff6-187bca92f3f9',
          balance: 1000,
          currency_code: 'EUR',
          company_uuid: 'c0c54d7a-e4fe-47af-8ff6-187bca92f3f9',
          is_master_wallet: true,
        },
        {
          wallet_uuid: 'bbb54d7a-e4fe-47af-8ff6-187bca92f3f9',
          balance: 1000,
          currency_code: 'GBP',
          company_uuid: 'c0c54d7a-e4fe-47af-8ff6-187bca92f3f9',
          is_master_wallet: true,
        },
        {
          wallet_uuid: 'ccc54d7a-e4fe-47af-8ff6-187bca92f3f9',
          balance: 1000,
          currency_code: 'USD',
          company_uuid: 'c0c54d7a-e4fe-47af-8ff6-187bca92f3f9',
          is_master_wallet: true,
        },
      ]);
    });
};
