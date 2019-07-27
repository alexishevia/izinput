/* eslint no-console:[0] */

import { AsyncStorage } from "react-native";
import { createStore } from "redux";
import getFileRevision from "../api/getFileRevision";
import loadFile from "../api/loadFile";
import transactions from "../../redux/transactions";

const LOCAL_ITEM_KEY = "IZINPUT_LOCAL_COPY";

const defaultPlaybook = {
  contents: "",
  revision: null,
  store: [], // transactions
  lastAction: -1
};

// readLocalFile gets the latest known playbook data from the local fileSystem
async function readLocalFile() {
  try {
    // await AsyncStorage.removeItem(LOCAL_ITEM_KEY);
    const str = await AsyncStorage.getItem(LOCAL_ITEM_KEY);
    if (!str) return defaultPlaybook;
    return JSON.parse(str);
  } catch (err) {
    console.log("Error while reading local file:", err);
    return defaultPlaybook;
  }
}

// updateLocalFile saves playbook data into the local filesystem
function updateLocalFile(data) {
  return AsyncStorage.setItem(LOCAL_ITEM_KEY, JSON.stringify(data));
}

// buildPlaybook generates a new playbook by applying actions from remoteFile
// into localData.store
function buildPlaybook({ localData, remoteFile }) {
  const { rev, text } = remoteFile;
  const { store: initialStore, lastAction: initialLastAction } = localData;
  let lastAction = initialLastAction;

  const store = createStore(transactions.reducer, initialStore);

  text.split("\n").forEach((str, lineNum) => {
    if (!str || lineNum <= lastAction) {
      return;
    }
    const action = JSON.parse(str);
    store.dispatch(action);
    lastAction = lineNum;
  });

  return {
    contents: text,
    revision: rev,
    store: store.getState(),
    lastAction
  };
}

export default async function downloadRemoteChanges({ accessToken, filepath }) {
  console.log("downloadRemoteChanges: START");

  const localData = await readLocalFile();
  const remoteRevision = await getFileRevision({ accessToken, path: filepath });

  if (localData.revision === remoteRevision) {
    console.log("downloadRemoteChanges: NO CHANGES");
    return localData;
  }

  console.log("downloadRemoteChanges: CHANGES DETECTED");

  const remoteFile = await loadFile({ accessToken, path: filepath });
  const remoteData = buildPlaybook({ localData, remoteFile });

  await updateLocalFile(remoteData);

  console.log("downloadRemoteChanges: CHANGES SYNCED");

  return remoteData;
}
