import { createSlice } from "redux-starter-kit";
import useDropbox from "./useDropbox";
import refresh from "./refresh";

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
      return {
        type,
        accessToken,
        path: "",
        fileType: "directory",
        contents: null
      };
    },
    reset: () => null,
    setContents: (state, { payload }) => ({
      ...state,
      contents: payload
    }),
    open: (state, { payload }) => {
      return {
        ...state,
        path: payload.path,
        fileType: payload.fileType,
        contents: null
      };
    },
    goBack: state => {
      if (!state || state.path === "") return state;
      return {
        ...state,
        path: getParentDir(state.path),
        contents: null
      };
    }
  }
});

slice.actions.useDropbox = () => (dispatch, getState) => {
  return useDropbox({ dispatch, getState, mount: slice.actions.mount });
};

slice.actions.refresh = () => (dispatch, getState) => {
  return refresh({
    dispatch,
    getState,
    setContents: slice.actions.setContents,
    getAccessToken: slice.selectors.getAccessToken,
    getPath: slice.selectors.getPath
  });
};

slice.selectors = {
  isMounted: state => !!(state.fileSystem && state.fileSystem.accessToken),
  isFileSelected: state =>
    !!(state.fileSystem && state.fileSystem.fileType === "file"),
  isRoot: state => !!(state.fileSystem && state.fileSystem.path === ""),
  getAccessToken: state => state.fileSystem.accessToken,
  getPath: state => state.fileSystem && state.fileSystem.path,
  getContents: state => state.fileSystem && state.fileSystem.contents
};

export default slice;
