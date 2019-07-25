import { combineReducers } from "redux";
import errors from "./errors";
import router from "./router";
import transactions from "./transactions";
import dropbox from "./dropbox";

const reducer = combineReducers({
  errors: errors.reducer,
  route: router.reducer,
  transactions: transactions.reducer,
  dropbox: dropbox.reducer
});

export default reducer;
