/* eslint no-console:[0] */

import dropbox from "../redux";
import downloadRemoteChanges from "./downloadRemoteChanges";
import uploadLocalChanges from "./uploadLocalChanges";

// sync works as a redux-thunk
const sync = () => async (dispatch, getState) => {
  const state = getState();
  const accessToken = dropbox.selectors.getAccessToken(state);
  const filepath = dropbox.selectors.getFilePath(state);

  if (!accessToken || !filepath) {
    console.log("sync cannot run if dropbox is not connected");
    return;
  }

  const playbook = await downloadRemoteChanges({ accessToken, filepath });
  console.log(playbook);
  await uploadLocalChanges({ playbook });
};

export default sync;
