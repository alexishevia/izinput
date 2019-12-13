import { createSelector } from "reselect";
import { transactions as transactionsSlice } from "izreducer";
import { MAX_TRANSACTIONS } from "./constants";

function sortByDateStrDesc(dateStrA, dateStrB) {
  if (dateStrA < dateStrB) return 1;
  if (dateStrA > dateStrB) return -1;
  return 0;
}

function sortTransactions(txA, txB) {
  return sortByDateStrDesc(txA.modifiedAt, txB.modifiedAt);
}

export const sortedTransactions = createSelector(
  [transactionsSlice.selectors.active],
  transactions => transactions.sort(sortTransactions)
);

export const latestTransactions = createSelector(
  [sortedTransactions],
  transactions => transactions.slice(0, MAX_TRANSACTIONS)
);
