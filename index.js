'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const { server: serverConfig } = require('config');
const HapiSwagger = require('hapi-swagger');

const packageInfos = require('./package');
const routes = require('./src/routes');

const init = async () => {
  const server = Hapi.server(serverConfig);

  // Basic swagger options
  const swaggerOptions = {
    info: {
      title: 'Banking API documentation',
      version: packageInfos.version,
    },
  };

  // Registering Hapi plugins
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  server.route(routes);

  await server.start();

  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();
