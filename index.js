const crypto = require("crypto");
const { DataSource } = require("apollo-datasource");
const { InMemoryLRUCache } = require("apollo-server-caching");
const Knex = require("knex");
const knexTinyLogger = require("knex-tiny-logger").default;

const { DEBUG } = process.env;

Knex.QueryBuilder.extend("load", function(ttl) {
  return this.client.load(ttl, this);
});

class SQLDataSource extends DataSource {
  constructor(knexConfig) {
    super();
    this.memoizedResults = new Map();
    this.context;
    this.cache;
    this.db = Knex(knexConfig);
    const _this = this;
    this.db.client.load = (ttl, query) => {
      return _this.load(ttl, query);
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

  load(ttl, query) {
    const cacheKey = this.getCacheKey(ttl, query);
    let promise = this.memoizedResults.get(cacheKey);
    if (promise) return promise;
    if (!ttl) {
      promise = this.getResult(ttl, query, cacheKey);
      this.memoizedResults.set(cacheKey, this.getResult(ttl, query, cacheKey));
      return promise;
    }
    promise = this.cacheQuery(ttl, query);
    this.memoizedResults.set(cacheKey, promise);
    return promise;
  }

  getResult(ttl, query, cacheKey) {
    return query.then(rows => {
      if (!ttl || !rows) return Promise.resolve(rows);
      this.cache.set(cacheKey, JSON.stringify(rows), { ttl });
      return Promise.resolve(rows);
    });
  }

  cacheQuery(ttl, query, cacheKey) {
    return this.cache.get(cacheKey).then(entry => {
      if (entry) return Promise.resolve(JSON.parse(entry));
      return this.getResult(ttl, query, cacheKey);
    });
  }
}

module.exports = { SQLDataSource };
