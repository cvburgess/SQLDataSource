import { expectError, expectType } from "tsd";
import Knex from "knex";
import { SQLDataSource } from "./index";

interface MyTestContext {
  foo: string;
}

type MyRow = { id: string; value: number };
class MyTestDataSource extends SQLDataSource<MyTestContext> {
  public testKnexExists() {
    expectType<Knex>(this.knex);
  }

  public testDbExists() {
    expectType<Knex>(this.db);
  }

  public testContextExists() {
    expectType<MyTestContext>(this.context);
  }

  public async testCacheFunctionPassesResult() {
    expectType<MyRow[]>(
      await this.knex<MyRow>("mytable")
        .select("id", "value")
        .where("id", "1")
        .cache()
    );
  }

  public async testCacheFunctionAcceptsTTL() {
    expectType<MyRow[]>(
      await this.knex<MyRow>("mytable")
        .select("id", "value")
        .where("id", "1")
        .cache(5)
    );
  }
}

new MyTestDataSource({
  connection: {
    port: 80,
    host: "somethimg"
  }
});

new MyTestDataSource(
  Knex({
    connection: {
      port: 80,
      host: "something"
    }
  })
);

expectError(new MyTestDataSource("something not knex config"));
expectError(new MyTestDataSource());
