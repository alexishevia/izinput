import sync from "./index";

const syncThunk = () => (dispatch, getState) => {
  return sync({ store: { dispatch, getState } });
};

export default syncThunk;
