/* eslint no-underscore-dangle:[0] */

import LocalFile from "./LocalFile";
import { rehydrateStore, removeLocalActions } from "./actions";
import { getLocalActions } from "./selectors";

export default async function runSynchronization({
  localStorage,
  remoteStorage,
  store /* , startTime */
}) {
  const localFile = new LocalFile({ localStorage, remoteStorage });
  await localFile.pull();

  const actionsToUpload = getLocalActions(store.getState());
  if (actionsToUpload.length) {
    localFile.appendActions(actionsToUpload);
    await localFile.push();
  }

  const pendingLocalActions = getLocalActions(store.getState()).filter(
    action => !actionsToUpload.includes(action)
  );
  localFile.appendActions(pendingLocalActions);

  store.dispatch(rehydrateStore(localFile.store.getState()));
  store.dispatch(removeLocalActions(actionsToUpload));
}
