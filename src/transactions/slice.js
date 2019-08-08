import { createSlice } from "redux-starter-kit";
import uuid from "uuid/v1";
import categories from "../categories/slice";

const MAX_TRANSACTIONS = 10;

function sortByModifiedAt(txA, txB) {
  return new Date(txB.modifiedAt) - new Date(txA.modifiedAt);
}

function limitTransactions(transactions) {
  return Object.entries(transactions)
    .sort(([, txA], [, txB]) => sortByModifiedAt(txA, txB))
    .filter((_, i) => i < MAX_TRANSACTIONS)
    .reduce((memo, [id, tx]) => ({ ...memo, [id]: tx }), {});
}

function isPutConflict(prevTx, newTx) {
  if (!prevTx) return false;
  return (
    prevTx.modifiedAt >= newTx.modifiedAt ||
    prevTx.deletedAt >= newTx.modifiedAt
  );
}

function isDeleteConflict(prevTx, newTx) {
  if (!prevTx) return true;
  return prevTx.modifiedAt >= newTx.deletedAt;
}

const slice = createSlice({
  slice: "transactions",
  initialState: {},
  reducers: {
    put: (state, { payload: transaction }) => {
      if (isPutConflict(state[transaction.id], transaction)) {
        console.log(`conflict: ignoring PUT action for ${transaction.id}`);
        return state;
      }
      return limitTransactions({
        ...state,
        [transaction.id]: { ...state[transaction.id], ...transaction }
      });
    },
    delete: (state, { payload: transaction }) => {
      if (isDeleteConflict(state[transaction.id], transaction)) {
        console.log(`conflict: ignoring DELETE action for ${transaction.id}`);
        return state;
      }
      return limitTransactions({ ...state, [transaction.id]: transaction });
    }
  },
  extraReducers: {
    [categories.actions.rename]: (state, { payload: { from, to } }) => {
      return limitTransactions(
        Object.entries(state).reduce(
          (memo, [id, tx]) => ({
            ...memo,
            [id]: tx.category === from ? { ...tx, category: to } : tx
          }),
          {}
        )
      );
    },
    [categories.actions.delete]: (state, { payload: name }) => {
      return limitTransactions(
        Object.entries(state).reduce(
          (memo, [id, tx]) => ({
            ...memo,
            [id]: tx.category === name ? { ...tx, category: "" } : tx
          }),
          {}
        )
      );
    }
  }
});

const maskedPut = slice.actions.put;
slice.actions.put = ({ id, charge, category, description }) =>
  maskedPut({
    id: id || uuid(),
    charge,
    category,
    description,
    modifiedAt: new Date().toISOString()
  });
slice.actions.put.toString = () => maskedPut.toString();

const maskedDelete = slice.actions.delete;
slice.actions.delete = id => {
  return maskedDelete({ id, deletedAt: new Date().toISOString() });
};
slice.actions.delete.toString = () => maskedDelete.toString();

slice.selectors = {
  active: state => {
    return Object.values(state.transactions).filter(tx => !tx.deletedAt);
  }
};

export default slice;
