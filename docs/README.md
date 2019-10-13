# IZ Input

IZ Input is a React Native / Redux app that lets you keep track of the money you spend.

It is the first app I'm building for [Invoice Zero](https://github.com/alexishevia/invoice-zero) - a personal finance system I'm creating.

## Store

The redux store used by IZ Input has the following format:

```
{
  // current screen being displayed
  route: "/home",

  // available categories
  categories: ["foo", "bar"],

  // all financial transactions recorded by the app
  transactions: {
    [id1]: { ...transaction1 },
    [id2]: { ...transaction2 },
  },

  // error messages are collected as an array of strings, to be displayed to
  // the user as a modal or alert. Note: sync errors are not added here.
  errors: ["error message X", "error message Y", ...],

  // last date the reducer had a significant update.
  // Whenever the reducer version is updated, a full reprocessing is executed
  reducerVersion: '201910122305',

  // reduxFileSync state is managed by https://alexishevia.github.io/redux-file-sync/
  reduxFileSync: { ... }
}
```

## Transactions

Transactions are the basic unit of data in IZ Input.

A transaction looks like this:

```
{
  id: "123",
  amount: 12.50,
  category: "food",
  type: "CASH",
  cashFlow: "EXPENSE",
  description: "foo bar",
  transactionDate: "2019-07025",
  modifiedAt: "2019-07-25T01:39:17.591Z",
  deletedAt: "2019-07-28T21:37:39.106Z"
}
```

| field           | type   | required? | description                                               |
| --------------- | ------ | --------- | --------------------------------------------------------- |
| id              | string | required  | unique identifier for the transaction                     |
| amount          | float  | required  | amount of money paid                                      |
| category        | string | optional  | indicates the type of transaction that was executed       |
| type            | string | required  | one of: "CASH", "CREDIT", "TRANSFER"                      |
| cashFlow        | string | required  | one of: "INCOME", "EXPENSE"                               |
| description     | string | optional  | description for the transaction                           |
| transactionDate | string | required  | date on which the transaction occured                     |
| modifiedAt      | string | required  | last modification date. Must be a date in ISO 8601 format |
| deletedAt       | string | requried  | last deletion date. Must be a date in ISO 8601 format     |

## Actions

I'm following the [redux](https://redux.js.org/) approach, where state is modified through actions.

Transactions can only be modified using these actions:

```
{ "type": "transactions/putv1", "payload": { id, amount, category, type, cashFlow, description, transactionDate, modifiedAt } }
{ "type": "transactions/delete", "payload": { id, deletedAt } }
```

Categories can only be modified using these actions:

```
{ "type": "categories/new", "payload": "category name" },
{ "type": "categories/rename", "payload": { "from": "old category name", "to": "new category name" },
{ "type": "categories/delete", "payload": "category name" }
```

Notes:
- On `categories/rename`, all transactions with the old category name are updated.
- On `categories/delete`, all transactions with the old category name are marked as `category: ""`.

## Conflicts

The following operations are considered conflicts, and are **ignored** by reducers:

- `transactions/putv1` with `modifiedAt <= existingTransaction.modifiedAt`.
- `transactions/putv1` with `deletedAt <= existingTransaction.modifiedAt`.
- `transactions/delete` with `deletedAt <= existingTransaction.modifiedAt`.
- `categories/new` with a duplicate value.
- `categories/rename` on a non-existent category.
- `categories/delete` on a non-existent category.

## Sync

IZ Input applications are "offline-first", which means they always store changes
locally, and will sync to an external Dropbox file when the internet connection
allows it.

I'm leveraging the [redux-file-sync](https://alexishevia.github.io/redux-file-sync/) module to get this functionality.
