import ReduxFileSync from "redux-file-sync";
import transactions from "./transactions/slice";
import categories from "./categories/slice";
import rootReducer from "./reducer";

const reduxFileSync = new ReduxFileSync(rootReducer, {
  actionsToSync: [
    transactions.actions.put.toString(),
    transactions.actions.delete.toString(),
    categories.actions.new.toString(),
    categories.actions.rename.toString(),
    categories.actions.delete.toString()
  ],
  whitelist: ["transactions", "categories"]
});

export default reduxFileSync;
