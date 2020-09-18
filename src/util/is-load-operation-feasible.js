'use strict';

module.exports = {
  isLoadOperationFeasible: ({ wallet, card, amount }) => {
    return 0 <= wallet.balance - amount && 0 <= card.balance + amount;
  },
};
