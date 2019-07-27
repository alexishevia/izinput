import { combineReducers } from "redux";
import errors from "./errors";
import router from "./router";
import transactions from "./transactions";
import localActions from "./localActions";
import dropbox from "../Dropbox/redux";

const reducer = combineReducers({
  errors: errors.reducer,
  route: router.reducer,
  transactions: transactions.reducer,
  dropbox: dropbox.reducer,
  localActions: localActions.reducer
});

export default reducer;
