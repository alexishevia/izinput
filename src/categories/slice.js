import { createSlice } from "redux-starter-kit";

const slice = createSlice({
  slice: "categories",
  initialState: [],
  reducers: {
    new: (state, { payload: categoryName }) => {
      if (!categoryName || state.includes(categoryName)) {
        return state;
      }
      return [...state, categoryName];
    },
    rename: (state, { payload: { from, to } }) => {
      const idx = state.indexOf(from);
      if (idx === -1) return state;
      return [...state.slice(0, idx), to, ...state.slice(idx + 1)];
    },
    delete: (state, { payload: categoryName }) => {
      const idx = state.indexOf(categoryName);
      if (idx === -1) return state;
      return [...state.slice(0, idx), ...state.slice(idx + 1)];
    }
  }
});

slice.selectors = {
  all: state => state.categories
};

export default slice;
