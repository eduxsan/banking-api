'use strict';

module.exports = {
  isWalletTransferAffordable: ({ wallet, amount }) => 0 <= wallet.balance - parseInt(amount, 10),
}
