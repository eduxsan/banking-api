'use strict';

const { transfer: { fee } } = require('config');

const currencyConverter = require('../money/currency-converter');

const computeSameCurrencyBalances = ({ originWallet, targetWallet, amount }) => ({
  newOriginWalletBalance: originWallet.balance - amount,
  newTargetWalletBalance: targetWallet.balance + amount,
  companyFeeAmount: 0,
});

module.exports = {
  computeWalletBalances: async ({ originWallet, targetWallet, masterWallet, amount }) => {
    if (targetWallet.currencyCode === originWallet.currencyCode) {
      return computeSameCurrencyBalances({ originWallet, targetWallet, amount });
    }

    // We'll convert the amount, and get the percentage of fees from this converted amount.
    const convertedAmount = await currencyConverter.convertAmount({
      amount,
      originCurrency: originWallet.currencyCode,
      targetCurrency: targetWallet.currencyCode,
    });

    const companyFeeAmount = Math.floor(convertedAmount * fee);
    
    // Calculating the fees to transfer to the company's wallet and thus the rest going to the
    // target wallet.
    return {
      newOriginWalletBalance: originWallet.balance - amount,
      newTargetWalletBalance: targetWallet.balance + (convertedAmount - companyFeeAmount),
      companyFeeAmount,
      newMasterWalletBalance: masterWallet.balance + companyFeeAmount,
    };
  },
}
