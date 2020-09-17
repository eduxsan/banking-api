'use strict';

const fs = require('fs');

// Loading all the routes from subdirectories in order to export them.
let routes = [];

// Tiny & simple logic to load routes in subdirectories.
// I assume that all routes must be in subdirectories.
// It could be even more dynamic & automatic for a production app.
['card', 'wallet'].forEach(subDirectory => {
  fs.readdirSync(`${__dirname}/${subDirectory}`)
    .forEach(file => {
      routes = routes.concat(require(`./${subDirectory}/${file}`))
    });
});

module.exports = routes;
