const { DataSource } = require("apollo-datasource");
const knexTinyLogger = require("knex-tiny-logger").default;
const SQLCache = require("./SQLCache");

const { DEBUG } = process.env;

let hasLogger = false;

class SQLDataSource extends DataSource {
  initialize(config) {
    this.context = config.context;
    this.db = this.knex;

    if (DEBUG && !hasLogger) {
      hasLogger = true; // Prevent duplicate loggers
      knexTinyLogger(this.db); // Add a logging utility for debugging
    }

    this.sqlCache = new SQLCache(config.cache, this.knex);
    this.getBatched = query => this.sqlCache.getBatched(query);
    this.getCached = (query, ttl, isBatched) => this.sqlCache.getCached(query, ttl, isBatched);
  }
}

module.exports = SQLDataSource;
