'use strict';

const axios = require('axios');
const { fixer: { baseURL, timeout, accessKey, fakeCurrencyRate } } = require('config');
const { format } = require('date-fns');
const get = require('lodash/get');

const fixerClient = axios.create({
  baseURL: baseURL,
  timeout,
  responseType: 'json',
});

module.exports = {
  convertAmount: async ({
    amount,
    originCurrency,
    targetCurrency,
  }) => {
    const fixerResponse = await fixerClient.request({
      url: `/${format(new Date(), 'yyyy-MM-dd')}`,
      method: 'get',
      params: {
        access_key: accessKey,
        base: originCurrency,
        symbols: targetCurrency,
      },
    }).then(response => response.data);

    // Fixer has got some limitations on which base currency we use
    // (for instance, USD as a base currency doesn't work on the free plan).
    // For this exercise's sake, if we are in such a case, I'll fallback to a dummy
    // exchange rate (e.g. 1.2) if this happens, in order to act as is the API that we are using
    // for this exercise were to be working properly with an appropriate plan.
    const currencyRate = get(fixerResponse, `rates[${targetCurrency}]`, fakeCurrencyRate);

    // We are working with cents ; we trim comma values in this case
    return Math.floor(amount * currencyRate);
  },
};
