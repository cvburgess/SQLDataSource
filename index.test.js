// NOTE: Never use .toBe() for testing values use .toEqual()
// https://jestjs.io/docs/en/expect#toequalvalue

// const Knex = require("knex");
// const { SQLDataSource } = require("./index");

describe("jest", () => {
  test("is configured", () => expect(true).toBeTruthy());
});
