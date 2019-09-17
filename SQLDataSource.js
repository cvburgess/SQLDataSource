const { DataSource } = require("apollo-datasource");
const { InMemoryLRUCache } = require("apollo-server-caching");
const Knex = require("knex");
const knexTinyLogger = require("knex-tiny-logger").default;

const { DEBUG } = process.env;

let hasLogger = false;

class SQLDataSource extends DataSource {
  constructor(knexConfig) {
    super();

    this.cache = new InMemoryLRUCache();
    this.db = Knex(knexConfig);

    Knex.QueryBuilder.extend("cache", function(ttl = 60) {
      const cacheKey = this.toString();

      if (DEBUG && !hasLogger) {
        hasLogger = true; // Prevent duplicate loggers
        knexTinyLogger(this.db); // Add a logging utility for debugging
      }

      return this.cache.get(cacheKey).then(entry => {
        if (entry) return Promise.resolve(entry);
        return this.then(rows => {
          if (rows) this.cache.set(cacheKey, rows, { ttl });
          return Promise.resolve(rows);
        });
      });
    });
  }

  initialize(config) {
    if (config.cache) this.cache = config.cache;
  }
}

module.exports = SQLDataSource;
