import { createSlice } from "redux-starter-kit";
import uuid from "uuid/v1";
import persist from "./persist";

const newTransaction = ({ charge, description }) => ({
  id: uuid(),
  type: "manual",
  charge,
  description: description || "",
  transactionDate: new Date().toISOString(),
  isPersisted: false
});

// only keep the last N transactions. discard others (if they are persisted)
const stateLimit = (transaction, index) =>
  index < 10 || !transaction.isPersisted;

const slice = createSlice({
  slice: "transactions",
  initialState: [],
  reducers: {
    add: (state, { payload: { charge, description } }) =>
      [newTransaction({ charge, description }), ...state].filter(stateLimit),
    update: (state, { payload: transactions }) => {
      const updateMap = transactions.reduce(
        (memo, tx) => ({
          ...memo,
          [tx.id]: tx
        }),
        {}
      );
      return state
        .map(tx => (updateMap[tx.id] ? updateMap[tx.id] : tx))
        .filter(stateLimit);
    }
  }
});

slice.actions.persist = () => (dispatch, getState) => {
  return persist({ dispatch, getState, slice });
};

slice.selectors = {
  all: state => state.transactions,
  pending: state => state.transactions.filter(tx => !tx.isPersisted),
  hasPendingChanges: state =>
    !!(
      state.transactions &&
      state.transactions.filter(tx => !tx.isPersisted).length
    )
};

export default slice;
