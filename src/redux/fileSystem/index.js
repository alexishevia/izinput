import { createSlice } from "redux-starter-kit";

const slice = createSlice({
  slice: "fileSystem",
  initialState: null,
  reducers: {
    set: (state, { payload: { type, accessToken } }) => {
      if (type !== "dropbox") {
        throw new Error(`Invalid fileSystem type: ${type}`);
      }
      if (!accessToken || !accessToken.length) {
        throw new Error("accessToken is required");
      }
      return { type, accessToken };
    },
    reset: () => null
  }
});

slice.selectors = {
  isMounted: state => !!state.fileSystem,
  isFileSelected: state => state.fileSystem && state.fileSystem.filepath,
  getAccessToken: state => state.fileSystem.accessToken
};

export default slice;
