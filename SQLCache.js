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

  async getBatched(query) {
    const queryString = query.toString();

    console.log(`In getBatched. queryString: ${JSON.stringify(queryString)}`)

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

  async getCached(query, ttl, isBatched) {
    const queryString = query.toString();
    const cacheKey = `sqlcache:${queryString}`;

    console.log(`In getCached. queryString: ${JSON.stringify(queryString)}`)

    return this.cache.get(cacheKey)
      .then(entry => {
        if (entry) {
          console.log(`cache entry: ${JSON.stringify(entry)}`);
          return entry;
        }

        return (isBatched ? this.getBatched(query) : query)
          .then((queryResult) => {
            if (queryResult) this.cache.set(cacheKey, queryResult, ttl);

            return queryResult;
          });
    });
  }
}

module.exports = SQLCache;
