/* eslint no-param-reassign: [0] */

import { createStore } from "redux";
import reducer from "../../src/reducer";
import sync from "../../src/sync";
import { getSyncState, getLocalActions } from "../../src/sync/selectors";
import transactionsSlice from "../../src/transactions/slice";
import MemoryLocalStorage from "./MemoryLocalStorage";
import MemoryRemoteStorage from "./MemoryRemoteStorage";

export default function TestApp({ localStorage, remoteStorage } = {}) {
  const store = createStore(reducer);
  localStorage = localStorage || new MemoryLocalStorage();
  remoteStorage = remoteStorage || new MemoryRemoteStorage();

  function appsync() {
    return sync({ store, localStorage, remoteStorage });
  }

  function addTransaction(props) {
    store.dispatch(transactionsSlice.actions.put(props));
  }

  // add transactions in sequence, waiting 1 ms between each
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
    get remoteStorage() {
      return remoteStorage;
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
