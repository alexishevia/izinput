# IZ Input

IZ Input is a React Native / Redux app that lets you keep track of the money you spend.

It is the first app I'm building for "Invoice Zero" - a personal finance system I'm creating.

## Store

The redux store used by IZ Input has the following format:

```
{
  // error messages are collected as an array of strings, to be displayed to
  // the user as a modal or alert. Note: sync errors are not added here.
  errors: ["error message X", "error message Y", ...],

  // current screen being displayed
  route: "/home",

  // available categories
  categories: ["foo", "bar"],

  // all financial transactions recorded by the app
  transactions: {
    [id1]: { ...transaction1 },
    [id2]: { ...transaction2 },
  },

  // stores info regarding which Dropbox account/file to sync with
  dropbox: {
    accessToken: "foobar",
    filepath: "/path/to/file.ndjson"
  }

  _sync: {
    // actions that have been recorded locally but not synced to Dropbox yet
    localActions: [ { ...action1 }, { ...action2 } ],

    // timestamps for sync attemtps
    startedAt: "2019-07-28T22:19:23.102Z",
    succeededAt: "2019-07-28T22:19:41.181Z",
    failedAt: "2019-07-28T22:19:00.843Z",
    errorMessage: "Something went wrong."
  }
}
```

## Transactions

Transactions are the basic unit of data in IZ Input.

A transaction looks like this:

```
{
  id: "123",        // string. unique identifier for the transaction.
  charge: 12.50,    // float. amount of money paid.
  category: "food"  // string. indicates the type of transaction that was executed.
  type: "CASH"      // string. One of: "CASH", "CREDIT", "TRANSFER"
  description: "foo bar", // string. optional. description for the transaction.
  modifiedAt: "2019-07-25T01:39:17.591Z" // string. date in ISO 8601 format. last modification date.
  deletedAt: "2019-07-28T21:37:39.106Z"  // string or undefined. date in ISO 8601 format. last deletion date.
}
```

## Actions

I'm following the [redux](https://redux.js.org/) approach, where state is modified through actions.

Transactions can only be modified using these actions:

```
{ "type": "transactions/put", "payload": { id, charge, category, description, modifiedAt } }
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

- `transactions/put` with `modifiedAt <= existingTransaction.modifiedAt`.
- `transactions/put` with `deletedAt <= existingTransaction.modifiedAt`.
- `transactions/delete` with `deletedAt <= existingTransaction.modifiedAt`.
- `categories/new` with a duplicate value.
- `categories/rename` on a non-existent category.
- `categories/delete` on a non-existent category.

## Sync

IZ Input applications are "offline-first", which means they always store changes
locally, and will sync to an external Dropbox file when the internet connection
allows it.

IZ Input applications usually have 3 "data stores" active at the same time:

1. playbook  
   The playbook is a [Newline Delimited JSON](http://ndjson.org/) file that lives
   in Dropbox.
   - The playbook is considered the source of truth.
   - Every line in the playbook corresponds to an action.
   - The playbook is append-only. Applications are allowed to append new actions
     to the playbook, but MUST NOT modify existing actions.
   - Applications MUST process actions in the same order as they exist in the
     playbook.
   - Multiple applications can sync to a single playbook. eg: the mobile app and desktop app for the same user.
   - The playbook is versioned, and every version is identified through a `revision` string.

2. redux store  
   This is the plain-old store you would see in any redux application. It is kept in memory, and through the [redux-persist](https://github.com/rt2zz/redux-persist) module, also persisted to `AsyncStorage`.  
   One caveat: the redux store must keep a `localActions` array. Any action with potential to modify the playbook should be added to `localActions`.
3. local file  
   A JSON file kept in `AsyncStorage` that stores the following data:
   - `path`: path to the playbook on the remote file system.
   - `text`: local copy of the playbook text.
   - `revision`: last known `revision` of the playbook.
   - `lineCount`: last known line count for the playbook.
   - `store`: redux store built by processing all actions in the playbook.

Synchronization is executed in 2 steps, in sequential order:

1. Download playbook
2. Upload localActions

### Download playbook

1. Load and parse `localFile` from `AsyncStorage`.
2. Query playbook's latest revision.
3. If `latest revision === localFile.revision`, "download playbook" is complete. Otherwise, continue on step 4.
4. Download the playbook's text into `localFile.text`, and the playbook's revision into `localFile.revision`.
5. Parse playbook lines bigger than `localFile.lineCount`, and apply the actions to `localFile.store`.
6. Update the `localFile.lineCount` value.
7. Save the new `localFile` into `AsyncStorage`.

Note: if `remoteFile.path` is different than `localFile.path`, `localFile` is invalidated. A new sync runs assuming a blank local state.

### Upload localActions

1. Create a copy of `localActions`, call it `actionsToUpload`.
2. If `actionsToUpload` is empty, continue on step 9. Otherwise, continue on step 2.
3. Apply `actionsToUpload` to `localFile.store`.
4. Attach `actionsToUpload` (serialized as [ndjson](http://ndjson.org/)) to the end of `localFile.text`.
5. Upload `localFile.text` to Dropbox.  
   Notes:
   - if Dropbox reports a conflict, restart sync from the "download playbook" flow.
   - Optional: You can keep track of any action in `actionsToUpload` that was ignored, and NOT attach it to the playbook.
6. Update `localFile.revision` with the new revision provided by Dropbox, and `localFile.lineCount` with the new playbook line count.
7. Save the new `localFile` into `AsyncStorage`.
8. If there are any `reduxStore.localActions` that are not present in `actionsToUpload` (created while the sync was in process), apply them to `localFile.store`.
9. Update the redux store.
    - override `reduxStore` with `localFile.store`
    - remove any action in `actionsToUpload` from `reduxStore.localActions`

## Sync frequency

I still haven't figured out how often to run sync, but I need to make sure to:

- avoid running multiple sync operations in parallel
- display some info to the user regarding sync status
