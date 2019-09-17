# Changelog

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
