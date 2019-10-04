# SQLDataSource

This package combines the power of [Knex] with the ease of use of [Apollo DataSources].

## BREAKING CHANGE IN v0.2.0

## BREAKING CHANGES IN v1.0.0

Batching of queries is hacked together with `knex.raw()` - while this is not ideal, due to the way Knex works, I have not found a more consistent way to do this.
In v1.0.0 this lib has a new fluid interface that plays nicely with Knex and stays more true to the spirit of Apollo DataSources.

As such, when you use `getBatched` or `getBatchedAndCached` the result will not be the pretty, normalized output you may expect from Knex, it will be the raw output from your DB driver of choice as if you had run the query with `knex.raw()`.

```js
const query = this.db.select("*").from("fruit").where({ id: 1 }).cache();

**If you find a way to implement caching without using `knex.raw()` please open a PR!**
query.then(data => /* ... */ );
```

While I would love to spend more time investigating this, unfortunately my time is limited at the moment.
To use ( or not use ) the caching feature in v1, simply add `.cache()` to your Knex query.

Read more below about getting set up and customizing the cache controls.

## Getting Started

### Installation

To install SQLDataSource: `npm i datasource-sql`

And the peer dependencies (if you do not have them already): `npm i knex graphql`

### Usage

```js
const Knex = require("knex");
// MyDatabase.js

const { SQLDataSource } = require("datasource-sql");

const MINUTE = 60;

const knex = Knex({
  client: "pg",
  connection: {
    /* CONNECTION INFO */
  }
});

class MyDatabase extends SQLDataSource {
  constructor() {
    super();
    // Add your instance of Knex to the DataSource
    this.db = knex;
  getFruits() {
    return this.db
      .select("*")
      .from("fruit")
      .where({ id: 1 })
      .cache(MINUTE);
  }

  getUsers() {
    // This can be any valid Knex query
    const query = this.db.select().from("users");

    // A promise without any caching or batching
    return query;

    // Batch the query with DataLoader - RETURNS A RAW RESPONSE
    return this.getBatched(query);
}

    // Cache the result for 1 minute
    return this.getCached(query, MINUTE);

    // Batch the query and cache the result for 1 minute - RETURNS A RAW RESPONSE
    return this.getBatchedAndCached(query, MINUTE);
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

const db = new MyDatabase(knexConfig);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache,
  context,
  dataSources: () => ({
    db: new MyDatabase()
  })
  dataSources: () => ({ db })
});
```

## SQLCache

SQLCache is what makes SQLDataSource incredibly smart and preferment. A thin wrapper around Apollo's caching strategy and the optional addition of [DataLoader] make for the smallest number of queries possible hitting your database.

### Batching ( getBatched )

If you were to make the same query (example: `knex.select().from('users')`) in multiple resolvers you could be making a bunch of duplicate reads from your database.

SQLCache uses DataLoader to create a batched wrapper for knex ( `getBatched` ) that will only fire duplicate queries once, but returns the same result to all resolvers.

This method accepts one parameter:

`getBatched(knexQuery)`

- `knexQuery`: <knexObject> A knex object that has not been then'd

**NOTE: This method will return the raw response from your DB driver.**

### Caching ( getCached )

### Caching ( .cache( ttl ) )

If you were to make the same query over the course of multiple requests to your server you could also be making needless requests to your server - especially for expensive queries.

SQLCache leverages Apollo's caching strategy to save results between requests and makes that available via `getCached`.

This method accepts two parameters:

`getCached(knexQuery, ttlInSeconds)`

- `knexQuery`: <knexObject> A knex object that has not been then'd
- `ttlInSeconds`: <Number> number of seconds to keep cached results

### Why not both?

SQLDataSource leverages Apollo's caching strategy to save results between requests and makes that available via `.cache()`.

To leverage caching _*and*_ batching for a query, use the method `getCachedAndBatched` which wraps both methods.
This method accepts one OPTIONAL parameter, `ttl` that is the number of seconds to retain the data in the cache.

This method accepts the same two params as `getCached`:
The default value for cache is `5 seconds`.

`getBatchedAndCached(knexQuery, ttlInSeconds)`
configuration, SQLDataSource falls back to an InMemoryLRUCache like the [RESTDataSource].

- `knexQuery`: <knexObject> A knex object that has not been then'd
- `ttlInSeconds`: <Number> number of seconds to keep cached results

From the example in the usage section above:

```js
const query = this.db.select().from("users");
return this.getBatchedAndCached(query, MINUTE);
```

**NOTE: This method will return the raw response from your DB driver.**

### initialize

SQLDataSource creates a new SQLCache on every initialize call with the cache and context from Apollo Server so you never should be directly creating a new SQLCache.

Note: If no cache is configured, an [InMemoryLRUCache] cache is used.

## SQLDataSource

## SQLDataSource Properties

SQLDataSource is an ES6 Class that can be extended to make a new SQLDataSource and extends Apollo's base DataSource class under the hood.

( See the Usage section above for an example )

Like all DataSources, SQLDataSource has an initialize method that Apollo will call when a new request is routed.

The initialize call accepts a configuration object with a cache and context.

If no cache is provided in your Apollo configuration, SQLDataSource falls back to an InMemoryLRUCache like the [RESTDataSource].
If no cache is provided in your Apollo server

### context

The context from your Apollo server is available as `this.context`.

### db

The instance of knex you reference in the constructor is made available as `this.db`.

### Query methods

The methods from SQLCache ( `getBatched`, `getCached`, and `getBatchedAndCached` ) are combined with the provided knex object and appended to `this`.

## Debug mode

### Debug mode

To enable more enhanced logging via [knex-tiny-logger], set DEBUG=true in your environment variables.
To enable more enhanced logging via [knex-tiny-logger], set `DEBUG` to a truthy value in your environment variables.

## Contributing

All contributions are welcome!

Please open an issue or pull request.

[knex]: https://knexjs.org/
[apollo datasources]: https://www.apollographql.com/docs/apollo-server/features/data-sources.html
[dataloader]: https://github.com/facebook/dataloader
[inmemorylrucache]: https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-caching
[restdatasource]: https://www.apollographql.com/docs/apollo-server/features/data-sources.html#REST-Data-Source
[knex-tiny-logger]: https://github.com/khmm12/knex-tiny-logger
