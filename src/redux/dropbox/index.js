import { createSlice } from "redux-starter-kit";

/*
 * "dropbox" slice
 * Stores dropbox token and filepath for sync purposes.
 *
 * Format:
 * { accessToken: "foobar", filepath: "/path/to/file.ndjson" }
 */

const initialState = {
  accessToken: null,
  filepath: null
};

const slice = createSlice({
  slice: "dropbox",
  initialState,
  reducers: {
    login: (state, { payload: accessToken }) => ({ ...state, accessToken }),
    logout: () => initialState
  }
});

slice.selectors = {
  isLoggedIn: state => !!state.dropbox.accessToken,
  isFileSelected: state => !!state.dropbox.filepath
};

export default slice;
