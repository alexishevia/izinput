import { combineReducers } from "redux";
import fileSystem from "./fileSystem";
import loading from "./loading";
import errors from "./errors";
import transactions from "./transactions";

const reducer = combineReducers({
  isLoading: loading.reducer,
  errors: errors.reducer,
  fileSystem: fileSystem.reducer,
  transactions: transactions.reducer
});

export default reducer;
