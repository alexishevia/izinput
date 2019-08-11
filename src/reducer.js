import { combineReducers } from "redux";
import router from "./router/slice";
import transactions from "./transactions/slice";
import categories from "./categories/slice";
import errors from "./errors/slice";
import dropbox from "./Dropbox/slice";
import syncReducer from "./sync/reducer";

const reducer = combineReducers({
  [router.slice]: router.reducer,
  [transactions.slice]: transactions.reducer,
  [categories.slice]: categories.reducer,
  [errors.slice]: errors.reducer,
  [dropbox.slice]: dropbox.reducer,
  _sync: (state = {}) => state
});

export default syncReducer(reducer, {
  whitelist: ["transactions", "categories"],
  actionsToSync: [
    transactions.actions.put.toString(),
    transactions.actions.delete.toString(),
    categories.actions.new.toString(),
    categories.actions.rename.toString(),
    categories.actions.delete.toString()
  ]
});
