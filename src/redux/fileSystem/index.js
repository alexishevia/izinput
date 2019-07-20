import { createSlice } from "redux-starter-kit";
import useDropbox from "./useDropbox";

function getParentDir(path) {
  return path
    .split("/")
    .slice(0, -1)
    .join("/");
}

const slice = createSlice({
  slice: "fileSystem",
  initialState: null,
  reducers: {
    mount: (state, { payload: { type, accessToken } }) => {
      if (type !== "dropbox") {
        throw new Error(`Invalid fileSystem type: ${type}`);
      }
      if (!accessToken || !accessToken.length) {
        throw new Error("accessToken is required");
      }
      return { type, accessToken, path: "", fileType: "directory" };
    },
    reset: () => null,
    goBack: state => {
      if (!state || state.path === "") return state;
      return { path: getParentDir(state.path), type: "directory" };
    }
  }
});

slice.actions.useDropbox = () => (dispatch, getState) => {
  return useDropbox({ dispatch, getState, mount: slice.actions.mount });
};

slice.selectors = {
  isMounted: state => !!state.fileSystem,
  isFileSelected: state =>
    state.fileSystem && state.fileSystem.fileType === "file",
  isRoot: state => state.fileSystem && state.fileSystem.path === "",
  getAccessToken: state => state.fileSystem.accessToken
};

export default slice;
