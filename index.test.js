// NOTE: Never use .toBe() for testing values use .toEqual()
// https://jestjs.io/docs/en/expect#toequalvalue

describe("jest", () => {
  test("is configured", () => expect(true).toBeTruthy());
});
