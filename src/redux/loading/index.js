import { createSlice } from "redux-starter-kit";

const slice = createSlice({
  slice: "isLoading",
  initialState: false,
  reducers: {
    start: () => true,
    stop: () => false
  }
});

slice.selectors = {
  isLoading: state => !!state.isLoading
};

export default slice;
