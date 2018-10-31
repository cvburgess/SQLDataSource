const SQLCache = require("./SQLCache");
const knexTinyLogger = require("knex-tiny-logger").default;

const { DEBUG } = process.env;

class SQLDataSource {
  initialize(config) {
    if (DEBUG) knexTinyLogger(this.knex); // Add a logging utility for debugging
    this.context = config.context;
    this.db = this.knex;
    this.sqlCache = new SQLCache(config.cache, this.knex);
    this.getBatched = query => this.sqlCache.getBatched(query);
    this.getCached = (query, ttl) => this.sqlCache.getCached(query, ttl);
    this.getBatchedAndCached = (query, ttl) =>
      this.sqlCache.getBatchedAndCached(query, ttl);
  }
}

module.exports = SQLDataSource;
