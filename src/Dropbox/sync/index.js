/* eslint no-console:[0] */

import dropbox from "../redux";
import downloadRemoteChanges from "./downloadRemoteChanges";
import uploadLocalChanges from "./uploadLocalChanges";
import localActionsSlice from "../../redux/localActions";
import transactions from "../../redux/transactions";

// sync works as a redux-thunk
const sync = () => async (dispatch, getState) => {
  const state = getState();
  const accessToken = dropbox.selectors.getAccessToken(state);
  const path = dropbox.selectors.getFilePath(state);

  if (!accessToken || !path) {
    console.log("sync cannot run if dropbox is not connected");
    return;
  }

  let playbook = await downloadRemoteChanges({ accessToken, path });
  console.log("downloaded playbook", playbook);

  playbook = await uploadLocalChanges({
    accessToken,
    path,
    playbook,
    localActions: state.localActions
  });
  console.log("uploaded playbook", playbook);

  dispatch(localActionsSlice.actions.remove(state.localActions));
  dispatch(transactions.actions.reset(playbook.store));
};

export default sync;
