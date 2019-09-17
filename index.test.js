// NOTE: Never use .toBe() for testing values use .toEqual()
// https://jestjs.io/docs/en/expect#toequalvalue

const Knex = require("knex");
const SQLDataSource = require("./SQLDataSource");
const mockConsole = require("jest-mock-console").default;

describe("jest", () => {
  test("is configured", () => expect(true).toBeTruthy());
});

const { TEST_PG_URL } = process.env;

// Create and destroy connection pool for tests
let knexConfig = { client: "pg", connection: TEST_PG_URL };

describe("Caching", () => {
  test("duplicate DB calls result in a singular hit", () => {
    class TestDB extends SQLDataSource {
      getFruit() {
        return this.db
          .select("*")
          .from("fruit")
          .where({ id: 1 })
          .cache();
      }
    }

    const testDB = new TestDB(knexConfig);
    const initialize = () => testDB.initialize({});

    expect(initialize).toThrow(Error);
  });
});
