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

    if (!this.db) throw configError;
    if (this.knex) {
      // eslint-disable-next-line
      console.warn("this.knex has been deprecated, use this.db instead");
    }

    if (DEBUG && !hasLogger) {
      hasLogger = true; // Prevent duplicate loggers
      knexTinyLogger(this.db); // Add a logging utility for debugging
    }

    this.sqlCache = new SQLCache(config.cache, this.db);
    this.getBatched = query => this.sqlCache.getBatched(query);
    this.getCached = (query, ttl) => this.sqlCache.getCached(query, ttl);
    this.getBatchedAndCached = (query, ttl) =>
      this.sqlCache.getBatchedAndCached(query, ttl);
  }
}

module.exports = SQLDataSource;
