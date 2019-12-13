import { transactions } from "izreducer";
import { MAX_TRANSACTIONS } from "./constants";

const initialState = {};

export default function(state = initialState, action) {
  const newState = transactions.reducer(state, action);
  if (newState === state) return state;

  // limit to most recent transactions
  return Object.entries(newState)
    .sort(([, valA], [, valB]) => {
      if (valA.modifiedAt > valB.modifiedAt) {
        return -1;
      }
      if (valA.transactionDate < valB.transactionDate) {
        return 1;
      }
      return 0;
    })
    .slice(0, MAX_TRANSACTIONS)
    .reduce((memo, [key, val]) => {
      memo[key] = val;
      return memo;
    }, {});
}
