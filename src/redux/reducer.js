import { combineReducers } from "redux";
import loading from "./loading";
import errors from "./errors";
import transactions from "./transactions";

const reducer = combineReducers({
  isLoading: loading.reducer,
  errors: errors.reducer,
  transactions: transactions.reducer
});

export default reducer;
