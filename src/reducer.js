import { combineReducers } from "redux";
import { transactions, categories } from "izreducer";
import router from "./router/slice";
import errors from "./errors/slice";
import reducerVersion from "./reducerVersion/slice";
import transactionsReducer from "./transactions/reducer";

export default combineReducers({
  [router.slice]: router.reducer,
  [transactions.slice]: transactionsReducer,
  [categories.slice]: categories.reducer,
  [errors.slice]: errors.reducer,
  [reducerVersion.slice]: reducerVersion.reducer,
  reduxFileSync: (state = {}) => state
});
