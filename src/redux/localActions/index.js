import { createAction } from "redux-starter-kit";

/*
 * Stores all actions that affect transactions. Used for sync purposes.
 *
 * Format:
 * [{ ...action1 }, ..., { ...actionN }]
 */

const initialState = [];

// pass an array to remove() with all actions you want removed
const remove = createAction("remove");

function reducer(state = initialState, action) {
  if (["transactions/add", "transactions/update"].includes(action.type)) {
    return [...state, action];
  }
  if (action.type === remove.toString()) {
    return state.filter(ac => !action.payload.includes(ac));
  }
  return state;
}

export default {
  reducer,
  actions: {
    remove
  }
};
