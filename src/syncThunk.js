import { AsyncStorage } from "react-native";
import { provider, selectors } from "redux-file-sync/lib/dropbox";
import reduxFileSync from "./reduxFileSync";
import reducerVersion from "./reducerVersion/slice";

const { getAccessToken, getFilePath } = selectors;

const syncThunk = () => (dispatch, getState) => {
  const state = getState();
  const accessToken = getAccessToken(state);
  const path = getFilePath(state);
  const upToDate = reducerVersion.selectors.isUpToDate(state);

  return reduxFileSync
    .sync({
      store: { dispatch, getState },
      localStorage: AsyncStorage,
      cloudStorage: provider({ accessToken, path }),
      reprocessAll: !upToDate
    })
    .then(() => {
      if (!upToDate) {
        dispatch(reducerVersion.actions.update());
      }
    });
};

export default syncThunk;
