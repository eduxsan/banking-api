'use strict';

module.exports = {
  formatWalletOutput: ({ balance,  ...walletDatabaseRepresentation }) => ({
    walletUuid: walletDatabaseRepresentation.wallet_uuid,
    balance: parseInt(balance, 10),
    currencyCode: walletDatabaseRepresentation.currency_code,
    companyUuid: walletDatabaseRepresentation.company_uuid,
    isMasterWallet: walletDatabaseRepresentation.is_master_wallet,
  }),
};
