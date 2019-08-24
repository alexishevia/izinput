import { AsyncStorage } from "react-native";
import DropboxRemoteStorage from "./Dropbox/RemoteStorage";
import reduxFileSync from "./reduxFileSync";

const syncThunk = () => (dispatch, getState) => {
  const store = { dispatch, getState };
  const cloudStorage = new DropboxRemoteStorage(store);
  return reduxFileSync.sync({
    store,
    localStorage: AsyncStorage,
    cloudStorage
  });
};

export default syncThunk;
