/* eslint no-console:[0] */

import { createStore } from "redux";
import transactions from "../../redux/transactions";
import writeFile from "../api/writeFile";
import localFile from "./localFile";

async function uploadLocalActions({
  accessToken,
  path,
  playbook,
  localActions
}) {
  const newContents = [
    playbook.contents,
    ...localActions.map(JSON.stringify)
  ].join("\n");
  const { rev } = await writeFile({
    accessToken,
    path,
    text: newContents,
    rev: playbook.revision
  });
  return { contents: newContents, revision: rev };
}

export default async function uploadLocalChanges({
  accessToken,
  path,
  playbook,
  localActions
}) {
  console.log("uploadLocalChanges: START");

  if (localActions.length === 0) {
    console.log("uploadLocalChanges: NO CHANGES");
    return playbook;
  }

  console.log("uploadLocalChanges: CHANGES DETECTED");

  const store = createStore(transactions.reducer, playbook.store);
  localActions.forEach(store.dispatch);

  const { contents, revision } = await uploadLocalActions({
    accessToken,
    path,
    playbook,
    localActions
  });

  const newPlaybook = {
    contents,
    revision,
    store: store.getState(),
    lastAction: playbook.lastAction + localActions.length
  };

  await localFile.write(newPlaybook);

  console.log("uploadLocalChanges: CHANGES SYNCED");

  return newPlaybook;
}
