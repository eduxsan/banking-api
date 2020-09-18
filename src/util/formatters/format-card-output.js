'use strict';

module.exports = {
  // I could have spread and reattributed all the attributes but I usually prefer to be explicit in these kind
  // of specific cases where I like to have a clear view of what is mapped, and how
  // IMO spreading sometimes actually makes it less readable with a low added value
  formatCardOutput: ({ balance, number, ccv, status, ...cardDatabaseRepresentation }) => ({
    cardUuid: cardDatabaseRepresentation.card_uuid,
    walletUuid: cardDatabaseRepresentation.wallet_uuid,
    currencyCode: cardDatabaseRepresentation.currency_code,
    balance: parseInt(balance, 10),
    number,
    expirationDate: cardDatabaseRepresentation.expiration_date,
    // We would probably not want to expose such sensitive data in some cases,
    // especially for a frontend client. I'm doing it for the test purpose but this is sensitive data and
    // this would be taken into account for a "real" project (and thus probably not exposed)
    ccv, 
    userUuid: cardDatabaseRepresentation.user_uuid,
    status,
  }),
};
