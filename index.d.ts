declare module 'datasource-sql' {
    import * as knex from 'knex'

    // attempt at fixing the undefined function 'cache' on QueryBuilder - doesn't improve the situation
    //
    // interface QueryBuilderEx<TRecord extends {} = any, TResult = any> 
    //   extends QueryBuilder<TRecord, TResult> {
    //     cache(ttl: number): this;
    // }
    // interface KnexEx<TRecord extends {} = any, TResult = unknown[]>
    //   extends knex<TRecord, TResult> {
    //     <TRecord2 = TRecord, TResult2 = DeferredKeySelection<TRecord2, never>[]>(
    //         tableName?: Knex.TableDescriptor | Knex.AliasDict,
    //         options?: TableOptions
    //     ): QueryBuilderEx<TRecord2, TResult2>;
    // }

    export class SQLDataSource {
        knex: knex
        // for above attempt - knex: KnexEx
        
        constructor(...args: any[]);

        cacheQuery(...args: any[]): void;

        initialize(...args: any[]): void;
    }
}  
