import { combineReducers } from "redux";
import fileSystem from "./fileSystem";
import loading from "./loading";
import errors from "./errors";

const reducer = combineReducers({
  isLoading: loading.reducer,
  errors: errors.reducer,
  fileSystem: fileSystem.reducer
});

export default reducer;
