# SQLDataSource

This package combines the power of [Knex] with the ease of use of [Apollo DataSources].

## BREAKING CHANGES IN v1.0.0

In v1.0.0 this lib has a new fluid interface that plays nicely with Knex and stays more true to the spirit of Apollo DataSources.

```js
const query = this.knex.select("*").from("fruit").where({ id: 1 }).cache();

query.then(data => /* ... */ );
```

To use ( or not use ) the caching feature in v1, simply add `.cache()` to your Knex query.

Read more below about getting set up and customizing the cache controls.

## Getting Started

### Installation

To install SQLDataSource: `npm i datasource-sql`

### Usage

```js
// MyDatabase.js

const { SQLDataSource } = require("datasource-sql");

const MINUTE = 60;

class MyDatabase extends SQLDataSource {
  getFruits() {
    return this.knex
      .select("*")
      .from("fruit")
      .where({ id: 1 })
      .cache(MINUTE);
  }
}

module.exports = MyDatabase;
```

And use it in your Apollo server configuration:

```js
// index.js

const MyDatabase = require("./MyDatabase");

const knexConfig = {
  client: "pg",
  connection: {
    /* CONNECTION INFO */
  }
};

// you can also pass a knex instance instead of a configuration object
const db = new MyDatabase(knexConfig);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache,
  context,
  dataSources: () => ({ db })
});
```

### Caching ( .cache( ttl ) )

If you were to make the same query over the course of multiple requests to your server you could also be making needless requests to your server - especially for expensive queries.

SQLDataSource leverages Apollo's caching strategy to save results between requests and makes that available via `.cache()`.

This method accepts one OPTIONAL parameter, `ttl` that is the number of seconds to retain the data in the cache.

The default value for cache is `5 seconds`.

Unless [configured](https://www.apollographql.com/docs/apollo-server/data/data-sources/#using-memcachedredis-as-a-cache-storage-backend), SQLDataSource uses an InMemoryLRUCache like the [RESTDataSource].

## SQLDataSource Properties

SQLDataSource is an ES6 Class that can be extended to make a new SQLDataSource and extends Apollo's base DataSource class under the hood.

( See the Usage section above for an example )

Like all DataSources, SQLDataSource has an initialize method that Apollo will call when a new request is routed.

If no cache is provided in your Apollo server configuration, SQLDataSource falls back to the same InMemoryLRUCache leveraged by [RESTDataSource].

### context

The context from your Apollo server is available as `this.context`.

### knex

The knex instance is made available as `this.knex` or `this.db`.

## Debug mode

To enable more enhanced logging via [knex-tiny-logger], set `DEBUG` to a truthy value in your environment variables.

## NPM 7 note

While peer dependencies are not installed by default for NPM 6, [v7 will create a tree which could have peerDependencies added correctly](https://github.com/npm/rfcs/blob/main/implemented/0025-install-peer-deps.md).

## Contributing

All contributions are welcome!

Please open an issue or pull request.

[knex]: https://knexjs.org/
[apollo datasources]: https://www.apollographql.com/docs/apollo-server/features/data-sources.html
[dataloader]: https://github.com/facebook/dataloader
[inmemorylrucache]: https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-caching
[restdatasource]: https://www.apollographql.com/docs/apollo-server/features/data-sources.html#REST-Data-Source
[knex-tiny-logger]: https://github.com/khmm12/knex-tiny-logger
