'use strict';

const { formatWalletOutput } = require('../../../src/util/formatters/format-wallet-output');

it('formats a wallet database entry properly', () => {
  expect(
    formatWalletOutput({
      wallet_uuid: '5cdfc583-42a6-4252-b1b7-dad8018460e9',
      balance: '1234',
      currency_code: 'EUR',
      company_uuid: '43908712-8c80-46a9-839a-63b5d499b190',
      is_master_wallet: false,
    }),
  ).toEqual({
    walletUuid: '5cdfc583-42a6-4252-b1b7-dad8018460e9',
    balance: 1234,
    currencyCode: 'EUR',
    companyUuid: '43908712-8c80-46a9-839a-63b5d499b190',
    isMasterWallet: false,
  })
});
