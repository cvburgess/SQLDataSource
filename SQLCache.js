const { InMemoryLRUCache } = require("apollo-server-caching");
const crc = require("crc");

class SQLCache {
  constructor(cache = new InMemoryLRUCache(), knex, options = {}) {
    this.cache = cache;
    this.hashing = options.hashing;
  }

  getCacheKeyForQuery(query, ttl) {
    const queryString = query.toString();
    if (this.hashing) {
      return `sqlcache:${crc.crc32(queryString)}_${ttl}`;
    }
    return `sqlcache:${queryString}`;
  }
  getResult(query, ttl) {
    return query.then(rows => {
      if (!ttl || !rows) return Promise.resolve(rows);
      const cacheKey = this.getCacheKeyForQuery(query, ttl);
      this.cache.set(cacheKey, rows, { ttl });
      return Promise.resolve(rows);
    });
  }
  getCached(query, ttl) {
    if (!ttl) return this.getResult(query);
    const cacheKey = this.getCacheKeyForQuery(query, ttl);
    return this.cache.get(cacheKey).then(entry => {
      if (entry) return Promise.resolve(entry);
      return this.getResult(query, ttl);
    });
  }
}

module.exports = SQLCache;
