const { InMemoryLRUCache } = require("apollo-server-caching");
const DataLoader = require("dataloader");

class SQLCache {
  constructor(cache = new InMemoryLRUCache(), knex) {
    this.cache = cache;
    this.knex = knex;
    this.loader = new DataLoader(rawQueries =>
      Promise.all(rawQueries.map(rawQuery => knex.raw(rawQuery)))
    );
  }

  normalizeDBResult(result) {
    switch (this.knex.client) {
      case "postgres":
        return result && result.rows;
      case "mssql":
        return result;
      case "sqlite3":
        return result;
      // TODO: Test and implement remaining clients
      case "mysql":
      case "mysql2":
      case "oracledb":
      case "redshift":
      default:
        return result;
    }
  }

  getCacheKeyForQuery(query) {
    const queryString = query.toString();
    return `sqlcache:${queryString}`;
  }

  getBatched(query) {
    const queryString = query.toString();
    return this.loader.load(queryString).then(this.normalizeDBResult);
  }

  getCached(query, ttl) {
    const cacheKey = this.getCacheKeyForQuery(query);

    return this.cache.get(cacheKey).then(entry => {
      if (entry) return Promise.resolve(entry);
      return query.then(rows => {
        if (rows) this.cache.set(cacheKey, rows, ttl);
        return Promise.resolve(rows);
      });
    });
  }

  getBatchedAndCached(query, ttl) {
    const cacheKey = this.getCacheKeyForQuery(query);

    return this.cache.get(cacheKey).then(entry => {
      if (entry) return Promise.resolve(entry);

      return this.getBatched(query).then(rows => {
        if (rows) this.cache.set(cacheKey, rows, ttl);
        return Promise.resolve(rows);
      });
    });
  }
}

module.exports = SQLCache;
