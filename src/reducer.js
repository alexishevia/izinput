import { combineReducers } from "redux";
import router from "./router/slice";
import transactions from "./transactions/slice";
import categories from "./categories/slice";
import errors from "./errors/slice";

export default combineReducers({
  [router.slice]: router.reducer,
  [transactions.slice]: transactions.reducer,
  [categories.slice]: categories.reducer,
  [errors.slice]: errors.reducer,
  reduxFileSync: (state = {}) => state
});
