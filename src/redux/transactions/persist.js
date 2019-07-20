import loading from "../loading";
import errors from "../errors";
import fileSystem from "../fileSystem";
import Dropbox from "../../Dropbox";

const maxRetries = 3;

function isConflict(err) {
  try {
    return err.error.error_summary.includes("conflict");
  } catch (_) {
    return false;
  }
}

async function updateDropboxFile({
  accessToken,
  path,
  pending,
  retryCount = 0
}) {
  const { rev, text } = await Dropbox.loadFile({ accessToken, path });
  const newText = [text, ...pending.map(tx => JSON.stringify(tx))].join("\n");
  try {
    await Dropbox.writeFile({ accessToken, path, text: newText, rev });
    return true;
  } catch (err) {
    if (isConflict(err) && retryCount < maxRetries) {
      return updateDropboxFile({
        accessToken,
        path,
        pending,
        retryCount: retryCount + 1
      });
    }
    throw err;
  }
}

export default async function persist({ dispatch, getState, slice }) {
  const state = getState();
  const pending = slice.selectors
    .pending(state)
    .map(tx => ({ ...tx, isPersisted: true }));
  const isLoading = loading.selectors.isLoading(state);
  const isFileSelected = fileSystem.selectors.isFileSelected(state);

  if (!isFileSelected || !pending.length || isLoading) return;

  const accessToken = fileSystem.selectors.getAccessToken(state);
  const path = fileSystem.selectors.getPath(state);

  dispatch(loading.actions.start());

  try {
    await updateDropboxFile({ accessToken, path, pending });
    dispatch(slice.actions.update(pending));
  } catch (err) {
    dispatch(
      errors.actions.push({ error: err, description: "syncing with Dropbox" })
    );
  } finally {
    dispatch(loading.actions.stop());
  }
}
