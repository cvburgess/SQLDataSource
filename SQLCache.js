const { InMemoryLRUCache } = require("apollo-server-caching");
const DataLoader = require("dataloader");
const crc = require("crc");

class SQLCache {
  constructor(cache = new InMemoryLRUCache(), knex, options = {}) {
    this.cache = cache;
    this.hashing = options.hashing;
    this.loader = new DataLoader(rawQueries =>
      Promise.all(rawQueries.map(rawQuery => knex.raw(rawQuery)))
    );
  }

  getCacheKeyForQuery(query) {
    const queryString = query.toString();
    if (this.hashing) {
      return `sqlcache:${crc.crc32(queryString)}`;
    }
    return `sqlcache:${queryString}`;
  }

  getBatched(query) {
    // eslint-disable-next-line
    console.warn(
      "WARNING: batching is considered unstable and returns RAW responses"
    );

    const queryString = query.toString();
    return this.loader.load(queryString);
  }

  getCached(query, ttl) {
    const cacheKey = this.getCacheKeyForQuery(query);

    return this.cache.get(cacheKey).then(entry => {
      if (entry) return Promise.resolve(entry);
      return query.then(rows => {
        if (rows) this.cache.set(cacheKey, rows, { ttl });
        return Promise.resolve(rows);
      });
    });
  }

  getBatchedAndCached(query, ttl) {
    const cacheKey = this.getCacheKeyForQuery(query);

    return this.cache.get(cacheKey).then(entry => {
      if (entry) return Promise.resolve(entry);

      return this.getBatched(query).then(rows => {
        if (rows) this.cache.set(cacheKey, rows, { ttl });
        return Promise.resolve(rows);
      });
    });
  }
}

module.exports = SQLCache;
