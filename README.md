# Banking API

Hey guys! Here's my implementation of the Banking API.

# Project status

All the requested endpoints have been implemented.

Due to a lack of time however, I did not implement the following:

- The transfer feature that logs every database operation related to money transfer,
- An exhaustive set of unit tests & functional tests
- An efficient way to run the project easily (e.g. I was thinking about using Docker to make it easy for you to test everything without having to install some deps on your machine).
- A logging system
- Some developer-readable error codes to handle as it is supposed to be an API for the frontend.

Even though I didn't have enough time to implement all of that, here is what I have in mind when I'm thinkin about all these points:

## The transfer feature

To be efficient, and to avoid a too heavy code repeating the fact that we want to log transfers in various places, I would have worked on a way to make it a tiny bit generic so that every operation on the `persistence` layer impacting money would automatically log it in the `transfer` table.

## About tests

Only a couple of tests are setup (the ones that I had setup when I wanted to implement jest as a dep).

I'm usually unit-testing every logic that has any specific logic inside. This usually includes all layers of the code, except the persistence layer (that I usually test via integration/functional tests) & high level handlers (same ; usually via functional tests).

I'd have setup a functional test feature such as Gherkin tests (via cucumber) to do so. This is what I'm used to do usually.

## About running the project

Having a light `docker-compose.yml` with a `postgresql` image and another for the app itself would have been enough.

# Tech stack

This project is a NodeJS project, on its version 12. It is pure JavaScript (not TypeScript).

This project has got some dependencies - and I used `npm` to manage them.

This project also uses a `PostgreSQL` database to store the data structures and their associated data.

I used an HTTP framework named `hapi` to setup the API layer a bit more easily.

I also used various dependencies related to `hapi` such as `joi` for the payloads validation, or `boom` for error handling.

The API is REST-like (REST-ish) as it does not exactly follow the REST pattern for quickness' sake.

This project is exposing a `swagger` JSON file & an associated UI that you can reach to check all the available endpoints & test them. Check the `Installation` section to know more about that.

# Decisions made & assumptions

I made various assumptions & took some decisions following the case study that I'm going to list here. Do not hesitate to ask me questions about it if you need more details on my choices.

- I decided to store every monetary value as cents. Handling numerics can be quite a problem when it comes to perform some operations on them ; and we probably don't want to lose some money because of that.
- I made the decision for the `GET /wallets` endpoint to retrieve wallets associated to the user as specified, meaning that the endpoint will retrieve wallets that have an associated card linked to the requesting user.
- I did not use both the `company` & `user` headers all the time if I did not need them. In some cases, I could have kept both and added some more checks before performing some operations but it was overkill in my opinion.
- You will see that most of the queries are in a `persistence` layer, while some others are left in the `handlers` layer. While it may seem like a lack of separation of principles, I usually prefer to keep things simple and not have useless additional layers if I can avoid them, even if I eventually need to refactor such a tiny part to move it to the `persistence` layer later.
- I sometimes made the decision to make my code quite imperative to make things clear about what is going on, instead of using too much chaining.
- I made more assumptions that I also documented in the code. While I would not do that "usually", and as this project's code's purpose is to be read, I documented it more than I'd usually do and oriented these comments to you.


# Run the API

As I did not have time to setup Docker, you'll need to run the API manually.

This means that you will first need to install a PostgreSQL server on your machine (or use one that is reachable from your machine).

## 1. About the DB

Once you've got a working PostgreSQL server somewhere, create a `bank` (or another name) database on it.

```
CREATE DATABASE bank;
```

## 2. Configuration file

You'll then need to create a `config/development.js` file in which you'll add some environment-specific parameters related to the DB.

You should have something similar to this:

```js
'use strict';

module.exports = {
  database: {
    connection: {
      host: '127.0.0.1', 
      database: 'bank',
      user: 'postgres',
      password: 'postgres',
    },
  },
  fixer: {
    accessKey: 'fe32622712536fdef8e50d40a014937c',
  },
}
```

Change all the values accordingly based on your own configuration.

Please also specify your `fixer.io` access key that will be used to retrieve conversion rates for currencies.

## 3. Installing dependencies

I created a Makefile that should do the hard work for you.

All you need to do is run a `make install` at the root of the project. This will:

- Install `npm` dependencies,
- Create the database structure,
- Populate the `wallet` table with the master wallets for the 3 supported currencies.

## 4. Run it!

You're all set - all you need to do now is run the API.

Use `make start` (or `make dev` if you want to use `nodemon`).

## 5. Testing it

You should have access to a UI listing all the endpoints at [http://0.0.0.0:4321/documentation](http://0.0.0.0:4321/documentation).

> It may be at another location if you changed the host & port combination.

You'll also have access to the according `swagger` JSON file at [http://0.0.0.0:4321/swagger.json](http://0.0.0.0:4321/swagger.json)

## 6. Have fun 😊

Do not hesitate to reach me for any question / any issue when setting up the project 😃
