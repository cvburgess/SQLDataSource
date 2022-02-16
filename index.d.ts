import { Knex } from "knex";
import { DataSource } from "apollo-datasource";

declare module "knex" {
  interface QueryBuilder<TRecord extends {} = any, TResult = any> {
    cache: (ttl?: number) => QueryBuilder<TRecord, TResult>;
  }
}

export class SQLDataSource<TContext = any> extends DataSource<TContext> {
  protected context: TContext;
  protected knex: Knex;
  protected db: Knex;
  constructor(config: Knex.Config | Knex);
}
