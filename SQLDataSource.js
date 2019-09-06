const { DataSource } = require("apollo-datasource");
const knexTinyLogger = require("knex-tiny-logger").default;
const SQLCache = require("./SQLCache");

const { DEBUG } = process.env;

let hasLogger = false;

const configError = Error("You must set this.db to a valid knex instance");

class SQLDataSource extends DataSource {
  initialize(config) {
    this.context = config.context;
    this.db = this.db || this.knex;
    this.memoizedResults = new Map();
    if (!this.db) throw configError;
    if (this.knex) {
      // eslint-disable-next-line
      console.warn("this.knex has been deprecated, use this.db instead");
    }

    if (DEBUG && !hasLogger) {
      hasLogger = true; // Prevent duplicate loggers
      knexTinyLogger(this.db); // Add a logging utility for debugging
    }

    this.sqlCache = new SQLCache(config.cache, this.db, {
      hashing: this.hashing
    });
    this.getCached = (query, ttl) => this.sqlCache.getCached(query, ttl);
  }
  getBatchedAndCached(query, ttl) {
    const cacheKey = this.sqlCache.getCacheKeyForQuery(query, ttl);
    let promise = this.memoizedResults.get(cacheKey);
    if (promise) return promise;
    promise = this.sqlCache.getCached(query, ttl);
    this.memoizedResults.set(cacheKey, promise);
    return promise;
  }

  getBatched(query, ttl) {
    const cacheKey = this.sqlCache.getCacheKeyForQuery(query, ttl);
    let promise = this.memoizedResults.get(cacheKey);
    if (promise) return promise;
    promise = this.sqlCache.getResult(query, ttl);
    this.memoizedResults.set(cacheKey, promise);
    return promise;
  }
}

module.exports = SQLDataSource;
