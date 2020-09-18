.PHONY: install dev start

install:
	npm i && npx knex migrate:latest && npx knex seed:run

dev:
	NODE_ENV=development npx nodemon index.js

start:
	NODE_ENV=development node index.js
