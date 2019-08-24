/* eslint no-param-reassign: [0] */

import { createStore } from "redux";
import { getSyncState, getLocalActions } from "redux-file-sync/lib/selectors";
import reduxFileSync from "../../src/reduxFileSync";
import transactionsSlice from "../../src/transactions/slice";
import MemoryLocalStorage from "./MemoryLocalStorage";
import MemoryRemoteStorage from "./MemoryRemoteStorage";

export default function TestApp({ localStorage, cloudStorage } = {}) {
  const store = createStore(reduxFileSync.reducer);
  localStorage = localStorage || new MemoryLocalStorage();
  cloudStorage = cloudStorage || new MemoryRemoteStorage();

  function appsync() {
    return reduxFileSync.sync({ store, localStorage, cloudStorage });
  }

  function addTransaction(props) {
    return store.dispatch(transactionsSlice.actions.put(props));
  }

  // add transactions in sequence
  async function addTransactions(txsArr) {
    return txsArr.reduce((promise, tx) => {
      return promise.then(() => addTransaction(tx));
    }, Promise.resolve());
  }

  function deleteTransaction(id) {
    store.dispatch(transactionsSlice.actions.delete(id));
  }

  return {
    get store() {
      return store;
    },
    get localStorage() {
      return localStorage;
    },
    get cloudStorage() {
      return cloudStorage;
    },
    get transactions() {
      return transactionsSlice.selectors.active(store.getState());
    },
    get localActions() {
      return getLocalActions(store.getState());
    },
    get syncState() {
      return getSyncState(store.getState());
    },
    addTransaction,
    modifyTransaction: addTransaction,
    deleteTransaction,
    addTransactions,
    sync: appsync
  };
}
