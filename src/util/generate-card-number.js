'use strict';

module.exports = {
  // We will generate a random 16-length number for the card number for simplicity's sake.
  // However, in a production world, we'd have a UNIQUE constraint in the database and a probably more complex
  // way to generate card numbers in order to avoid duplicates and have a strong randomness factor, while
  // avoiding "simple" card numbers like all-zero numbers, etc.
  generateCardNumber: () => Math.floor(Math.random() * (8888888888888889)) + 1111111111111111,
  generateCcv: () => Math.floor(Math.random() * (889)) + 111,
}
