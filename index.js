const crypto = require("crypto");
const { DataSource } = require("apollo-datasource");
const { InMemoryLRUCache } = require("apollo-server-caching");
const Knex = require("knex");
const knexTinyLogger = require("knex-tiny-logger").default;

const { DEBUG } = process.env;

let hasLogger = false;

class SQLDataSource extends DataSource {
  constructor(knexConfig) {
    super();

    this.context;
    this.cache;

    if (typeof knexConfig === "function") {
      this.db = knexConfig;
    } else {
      this.db = Knex(knexConfig);
    }

    this.knex = this.db;
    const _this = this;
    
    const cachefn = function(ttl) {
      return _this.cacheQuery(ttl, this);
    };

    if (!this.db.cache) {
      // Extend modifies Knex prototype to include cache method.
      // Does not retroactively add cache to existing connection.
      Knex.QueryBuilder.extend("cache", cachefn);
      // Must be manually added to existing knex connection.
      this.db.cache = cachefn;
    }
  }

  initialize(config) {
    this.context = config.context;
    this.cache = config.cache || new InMemoryLRUCache();

    if (DEBUG && !hasLogger) {
      hasLogger = true; // Prevent duplicate loggers
      knexTinyLogger(this.db); // Add a logging utility for debugging
    }
  }

  cacheQuery(ttl = 5, query) {
    const cacheKey = crypto
      .createHash("sha1")
      .update(query.toString())
      .digest("base64");

    return this.cache.get(cacheKey).then(entry => {
      if (entry) return Promise.resolve(JSON.parse(entry));

      return query.then(rows => {
        if (rows) this.cache.set(cacheKey, JSON.stringify(rows), { ttl });

        return Promise.resolve(rows);
      });
    });
  }
}

module.exports = { SQLDataSource };
