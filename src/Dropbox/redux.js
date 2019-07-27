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
  filepath: null,
  sync: {
    startTimestamp: null,
    completeTimestamp: null,
    errorTimestamp: null,
    error: null
  }
};

const slice = createSlice({
  slice: "dropbox",
  initialState,
  reducers: {
    login: (state, { payload: accessToken }) => ({ ...state, accessToken }),
    logout: () => initialState,
    selectFile: (state, { payload: filepath }) => ({ ...state, filepath })
  }
});

slice.selectors = {
  isLoggedIn: state => !!state.dropbox.accessToken,
  isFileSelected: state => !!state.dropbox.filepath,
  getAccessToken: state => state.dropbox.accessToken,
  getFilePath: state => state.dropbox.filepath
};

export default slice;
