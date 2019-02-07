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

  getBatched(query) {
    const queryString = query.toString();

    return this.loader.load(queryString)
      .then((loaderResult) => {
        switch (this.knex.client) {
          case "pg":
            return loaderResult && loaderResult.rows;
          default:
            return loaderResult;
        }
      })
}

  getCached(query, ttl) {
    const queryString = query.toString();
    const cacheKey = `sqlcache:${queryString}`;

    return this.cache.get(cacheKey).then(entry => {
      if (entry) return Promise.resolve(entry);
      return query.then(rows => {
        if (rows) this.cache.set(cacheKey, rows, ttl);
        return Promise.resolve(rows);
      });
    });
  }

  getBatchedAndCached(query, ttl) {
    const queryString = query.toString();
    const cacheKey = `sqlcache:${queryString}`;

    return this.cache.get(cacheKey).then(entry => {
      if (entry) return Promise.resolve(entry);

      return this.getBatched(query)
        .then((queryResult) => {
          if (queryResult) this.cache.set(cacheKey, queryResult, ttl);

          return Promise.resolve(queryResult);
        });
    });
  }
}

module.exports = SQLCache;
