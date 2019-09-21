import { combineReducers } from "redux";
import { transactions, categories } from "izreducer";
import router from "./router/slice";
import errors from "./errors/slice";
import reducerVersion from "./reducerVersion/slice";

export default combineReducers({
  [router.slice]: router.reducer,
  [transactions.slice]: transactions.reducer,
  [categories.slice]: categories.reducer,
  [errors.slice]: errors.reducer,
  [reducerVersion.slice]: reducerVersion.reducer,
  reduxFileSync: (state = {}) => state
});
