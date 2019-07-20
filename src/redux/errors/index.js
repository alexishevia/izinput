import { createSlice } from "redux-starter-kit";
import stringifyError from "./stringifyError";

const slice = createSlice({
  slice: "errors",
  initialState: [],
  reducers: {
    push: (state, { payload: { error, description } }) => [
      ...state,
      stringifyError(error, description)
    ],
    reset: () => []
  }
});

slice.selectors = {
  all: state => state.errors.filter(Boolean)
};

export default slice;
