const crypto = require("crypto");
const { DataSource } = require("apollo-datasource");
const { InMemoryLRUCache } = require("apollo-server-caching");
const Knex = require("knex");
const knexTinyLogger = require("knex-tiny-logger").default;

const { DEBUG } = process.env;

Knex.QueryBuilder.extend("cache", function(ttl) {
  return this.client.cache(ttl, this);
});

class SQLDataSource extends DataSource {
  constructor(knexConfig) {
    super();
    this.context;
    this.cache;
    this.db = Knex(knexConfig);
    const _this = this;
    this.db.client.cache = (ttl, query) => {
      return _this.cacheQuery(ttl, query);
    };
    if (DEBUG) {
      knexTinyLogger(this.db); // Add a logging utility for debugging
    }
  }

  initialize({ context = {}, cache = new InMemoryLRUCache() } = {}) {
    this.context = context;
    this.cache = cache;
  }

  getCacheKey(ttl = "", query) {
    return crypto
      .createHash("sha1")
      .update(`${query.toString()}_${ttl}`)
      .digest("base64");
  }

  getResult(ttl, query, cacheKey) {
    return query.then(rows => {
      if (!ttl || !rows) return Promise.resolve(rows);
      this.cache.set(cacheKey, JSON.stringify(rows), { ttl });
      return Promise.resolve(rows);
    });
  }

  cacheQuery(ttl = 5, query) {
    const cacheKey = this.getCacheKey(ttl, query);
    return this.cache.get(cacheKey).then(entry => {
      if (entry) return Promise.resolve(JSON.parse(entry));
      return this.getResult(ttl, query, cacheKey);
    });
  }
}

module.exports = { SQLDataSource };
