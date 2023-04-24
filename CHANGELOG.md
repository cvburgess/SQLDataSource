# Changelog

## v2.1.0 - 04-24-2023

- Resolve issue with .cache declaration (#84) Thanks @daniel-keller

## v2.0.1 - 03-15-2022

- Update dependencies

## v2.0.0 - 03-15-2022

- Update imports to match [Knex v0.95+](https://github.com/knex/knex/blob/master/UPGRADING.md#upgrading-to-version-0950) ( Thanks @grusite )

## v1.6.0 - 10-04-2021

- Migrate knex to a peerDependencies ( Thanks @roy-coder )

## v1.5.0 - 08-09-2021

- Add types for `this.db` and `this.context` ( Thanks @astorije )

## v1.4.1 - 04-09-2021

- Support GraphQL versions >= v14

## v1.4.0 - 03-27-2021

- Add Typescript types ( Thanks @freshollie )

## v1.3.1 - 12-11-2020

- Various dependency security updates via dependabot

## v1.3.0 - 04-22-2020

- knex-tiny-logger update ( requires node v10+ )

## v1.2.1 - 04-22-2020

- Knex update ( v0.20.x )

## v1.2.0 - 04-07-2020

- Support specifying a knex instance instead of config object ( Thanks @theogravity! )

## v1.1.1 - 01-23-2020

- Knex update for security

## v1.1.0 - 12-30-2019

- Allow knex instance to be referenced by `this.knex` in addition to `this.db`

## v1.0.2 - 10-07-2019

- Fix issue with repeated constructor calls

## v1.0.1 - 09-18-2019

- Fix issue with Redis keys and values

## v1.0.0 - 09-17-2019

- Switch to an extended knex method (.cache) vs the old wrapper fns
- Remove batching support

## v0.2.0 - 08-07-2019

- Fix issues with lexical scoping [#19]
- Deprecate this.knex in favor of this.db
- Mark batching as experimental
- Update docs to reflect current development status

## v0.1.7 - 24-04-2019

- Fix for responses from sqlite and mssql drivers [#9]

## v0.1.6 - 05-04-2019

- Fix issue setting TTL on cache requests [#15]

## v0.1.5 - 28-02-2019

- Update dependencies to resolve cache TTL issue [#12]

## v0.1.4 - 28-11-2018

- Fix multiple onQuery logging events [#5]

## v0.1.3 - 20-11-2018

- Add support for multiple node and npm versions [#3]

## v0.1.2 - 06-11-2018

- Fix broken import

## v0.1.1 - 05-11-2018

- Add more documentation [#2]
- Extend the Apollo DataSource class

## v0.1.0 - 31-10-2018

- Initial publication
- Adds SQLCache and SQLDataSource classes

- [#2] https://github.com/cvburgess/SQLDataSource/issues/2
- [#3] https://github.com/cvburgess/SQLDataSource/issues/3
- [#5] https://github.com/cvburgess/SQLDataSource/issues/5
- [#12] https://github.com/cvburgess/SQLDataSource/issues/12
- [#15] https://github.com/cvburgess/SQLDataSource/issues/15
- [#9] https://github.com/cvburgess/SQLDataSource/issues/9
- [#19] https://github.com/cvburgess/SQLDataSource/issues/19
