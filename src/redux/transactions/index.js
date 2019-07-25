import { createSlice } from "redux-starter-kit";
import uuid from "uuid/v1";

/*
 * "transactions" slice
 * Stores the last 10 financial transactions that have been recorded in the app.
 *
 * Format:
 * [{ ...transacion1 }, ..., { ...transactionN }]
 *
 * transaction format:
 * {
 *   id: "123", // unique identifier for the transaction
 *   type: "manual", // type of transaction. only "manual" transactions
 *       are supported at the moment.
 *   charge: 12.50, // amount of money payed
 *   description: "foo bar", // description for the transaction
 *   lastModified: "2019-07-25T01:39:17.591Z" // date in ISO 8601 format.
 * }
 */

const newTransaction = ({ charge, description }) => ({
  id: uuid(),
  type: "manual",
  charge,
  description: description || "",
  transactionDate: new Date().toISOString()
});

// only keep the last N transactions. discard others (if they are persisted)
const stateLimit = (transaction, index) =>
  index < 10 || !transaction.isPersisted;

const slice = createSlice({
  slice: "transactions",
  initialState: [],
  reducers: {
    add: (state, { payload: newTx }) => [newTx, ...state].filter(stateLimit),
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

const maskedAdd = slice.actions.add;
slice.actions.add = ({ charge, description }) => dispatch => {
  const newTx = newTransaction({ charge, description });
  dispatch(maskedAdd(newTx));
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
