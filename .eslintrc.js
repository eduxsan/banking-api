'use strict';

module.exports = {
  env: {
    es6: true, // Enables ES6 support & its global variables
    node: true, // NodeJS environment
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 2020, // Woha!
    impliedStrict: true, // Strict mode by default
    sourceType: 'script', // "require" module imports only
  },
  reportUnusedDisableDirectives: true,
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'comma-style': ['error', 'last'],
    curly: 'error',
    eqeqeq: 'error',
    indent: ['error', 2],
    'no-console': 'off', // Would be on 'error' if this project was a production-ready one
    quotes: ['error', 'single'],
    yoda: ['error', 'always'], // I love yoda style :-)
  },
}
