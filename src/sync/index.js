import DropboxRemoteStorage from "../Dropbox/RemoteStorage";
import LocalAsyncStorage from "./LocalAsyncStorage";
import runSynchronization from "./run";
import { start, success, fail } from "./actions";
import { isSyncRunning } from "./selectors";
import stringifyError from "./stringifyError";

const DEFAULT_KEY = "IZINPUT_LOCAL_FILE";

// new LocalAsyncStorage.reset(DEFAULT_KEY).reset();

export default async function sync({ store, remoteStorage, localStorage }) {
  if (!store || !store.getState || !store.dispatch)
    throw new Error("store is required");
  if (isSyncRunning(store.getState())) {
    console.log("sync is already running. ignoring new sync() call");
    return;
  }
  try {
    const startTime = new Date().getTime();
    store.dispatch(start(startTime));
    await runSynchronization({
      localStorage: localStorage || new LocalAsyncStorage(DEFAULT_KEY),
      remoteStorage: remoteStorage || new DropboxRemoteStorage(store),
      store,
      startTime
    });
    store.dispatch(success());
  } catch (err) {
    console.log(err);
    store.dispatch(fail({ errorMessage: stringifyError(err) }));
  }
}
