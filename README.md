# SQLDataSource

This package combines the power of Knex with the ease of use of Apollo DataSources.

## Getting Started

### Installation

`npm i datasource-sql`

### Usage

```js
const Knex = require("knex");
const { SQLDataSource } = require("datasource-sql");

const MINUTE = 60 * 1000;

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
    this.knex = knex;
  }

  getUsers() {
    // This can be any valid Knex query
    const query = this.db.select().from("users");

    // Batch the query and cache the result for 1 minute
    return this.getBatchedAndCached(query, MINUTE);
  }
}
```

And use it in your Apollo server configuration:

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache,
  context,
  dataSources: () => ({
    db: new MyDatabase()
  })
});
```

## Contributing

All contributions are welcome!

Please open an issue or pull request.
