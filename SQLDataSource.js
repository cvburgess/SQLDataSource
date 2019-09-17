const { DataSource } = require("apollo-datasource");
const Knex = require("knex");
const knexTinyLogger = require("knex-tiny-logger").default;

const SQLCache = require("./SQLCache");

const { DEBUG } = process.env;

let hasLogger = false;

class SQLDataSource extends DataSource {
  constructor(knexConfig) {
    super();

    this.sqlCache = new SQLCache();
    this.db = Knex(knexConfig);

    const sqlCache = this.sqlCache;
    Knex.QueryBuilder.extend("cache", function(ttl = 60) {
      return sqlCache.getCached(this, ttl);
    });
  }

  initialize(config) {
    this.sqlCache = new SQLCache(config.cache, this.db);

    if (DEBUG && !hasLogger) {
      hasLogger = true; // Prevent duplicate loggers
      knexTinyLogger(this.db); // Add a logging utility for debugging
    }
  }
}

module.exports = SQLDataSource;
