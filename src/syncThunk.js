import { AsyncStorage } from "react-native";
import { provider, selectors } from "redux-file-sync/lib/dropbox";
import reduxFileSync from "./reduxFileSync";

const { getAccessToken, getFilePath } = selectors;

const syncThunk = () => (dispatch, getState) => {
  const state = getState();
  const accessToken = getAccessToken(state);
  const path = getFilePath(state);

  return reduxFileSync.sync({
    store: { dispatch, getState },
    localStorage: AsyncStorage,
    cloudStorage: provider({ accessToken, path })
  });
};

export default syncThunk;
