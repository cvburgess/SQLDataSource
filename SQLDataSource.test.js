const Knex = require("knex");
const SQLDataSource = require("./SQLDataSource");

const { TEST_PG_URL } = process.env;

// Create and destroy connection pool for tests
let knex;

beforeAll(() => {
  knex = Knex({ client: "pg", connection: TEST_PG_URL });
});

afterAll(() => {
  return knex.destroy();
});

describe("Configuration", () => {
  test("an error is thrown if this.db is not set", () => {
    class TestDB extends SQLDataSource {
      getFruit() {
        const query = this.db
          .select("*")
          .from("fruit")
          .where({ id: 1 });
        return this.getCached(query, 1);
      }
    }

    const testDB = new TestDB();
    const initialize = () => testDB.initialize({});

    expect(initialize).toThrow(Error);
  });
});

describe("PostgreSQL", () => {
  test("Batching and caching is configured", () => {
    class TestDB extends SQLDataSource {
      constructor() {
        super();
        this.db = knex;
        this.hashing = true;
      }

      getFruit() {
        const query = this.db
          .select("*")
          .from("fruit")
          .where({ id: 1 });
        return this.getCached(query, 1);
      }
    }

    const testDB = new TestDB();
    testDB.initialize({});

    return testDB.getFruit().then(result => {
      expect(result).toMatchSnapshot();
    });
  });
});
