/* eslint no-console:[0] */

import { createStore } from "redux";
import getFileRevision from "../api/getFileRevision";
import loadFile from "../api/loadFile";
import transactions from "../../redux/transactions";
import localFile from "./localFile";

// buildPlaybook generates a new playbook by applying actions from remoteFile
// into localData.store
function buildPlaybook({ localData, remoteFile }) {
  const { rev, text } = remoteFile;
  const { store: initialStore, lastAction: initialLastAction } = localData;
  let lastAction = initialLastAction;

  const store = createStore(transactions.reducer, initialStore);

  text.split("\n").forEach((str, lineNum) => {
    if (lineNum <= lastAction) return;
    lastAction = lineNum;
    if (!str) return;
    const action = JSON.parse(str);
    store.dispatch(action);
  });

  return {
    contents: text,
    revision: rev,
    store: store.getState(),
    lastAction
  };
}

export default async function downloadRemoteChanges({ accessToken, path }) {
  console.log("downloadRemoteChanges: START");

  const localData = await localFile.read();
  const remoteRevision = await getFileRevision({ accessToken, path });

  if (localData.revision === remoteRevision) {
    console.log("downloadRemoteChanges: NO CHANGES");
    return localData;
  }

  console.log("downloadRemoteChanges: CHANGES DETECTED");

  const remoteFile = await loadFile({ accessToken, path });
  const playbook = buildPlaybook({ localData, remoteFile });

  await localFile.write(playbook);

  console.log("downloadRemoteChanges: CHANGES SYNCED");

  return playbook;
}
