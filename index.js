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

  // Overriding the way we expose responses in case of errors to force having a clearer output.
  // In production, we'd probably need a better error handling strategy to obfuscate the errors enough,
  // By still providing developer-readable error codes that could be handled by the frontend/by any consumer.
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (!response.isBoom) {
      return h.continue;
    }

    return response;
  });

  await server.start();

  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();
