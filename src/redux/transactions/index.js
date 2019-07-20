import { createSlice } from "redux-starter-kit";
import uuid from "uuid/v4";

const newTransaction = ({ charge, description }) => {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    type: "manual",
    charge,
    description: description || "",
    transactionDate: now,
    processingDate: now,
    isPersisted: false
  };
};

const slice = createSlice({
  slice: "transactions",
  initialState: [],
  reducers: {
    add: (state, { payload: { charge, description } }) => [
      newTransaction({ charge, description }),
      ...state
    ]
  }
});

slice.selectors = {
  all: state => state.transactions
};

export default slice;
