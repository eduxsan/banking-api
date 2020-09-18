'use strict';

const { formatCardOutput } = require('../../../src/util/formatters/format-card-output');

it('formats a card database entry properly', () => {
  const dummyDate = new Date();

  expect(
    formatCardOutput({
      card_uuid: '235078b5-6871-4b13-8b93-59d5a7f69ae8',
      wallet_uuid: '5cdfc583-42a6-4252-b1b7-dad8018460e9',
      currency_code: 'USD',
      balance: '1234',
      number: '1234567898764321',
      expiration_date: dummyDate,
      ccv: '123',
      user_uuid: '664056c5-522c-43be-b6ac-076e5f280435',
      status: 'BLOCKED',
    }),
  ).toEqual({
    cardUuid: '235078b5-6871-4b13-8b93-59d5a7f69ae8',
    walletUuid: '5cdfc583-42a6-4252-b1b7-dad8018460e9',
    currencyCode: 'USD',
    balance: 1234,
    number: '1234567898764321',
    expirationDate: dummyDate,
    ccv: '123',
    userUuid: '664056c5-522c-43be-b6ac-076e5f280435',
    status: 'BLOCKED',
  })
});
