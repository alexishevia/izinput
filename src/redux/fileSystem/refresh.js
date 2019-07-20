import loading from "../loading";
import errors from "../errors";
import Dropbox from "../../Dropbox";

const refresh = async ({
  dispatch,
  getState,
  setContents,
  getAccessToken,
  getPath
}) => {
  const state = getState();

  if (loading.selectors.isLoading(state)) {
    console.log("App is loading. refresh() call ignored.");
    return;
  }

  dispatch(loading.actions.start());

  try {
    const accessToken = getAccessToken(state);
    const path = getPath(state);
    const result = await Dropbox.loadDir({ path, accessToken });
    dispatch(setContents(result.contents));
  } catch (err) {
    dispatch(
      errors.actions.push({
        error: err,
        description: "loading data from Dropbox"
      })
    );
  } finally {
    dispatch(loading.actions.stop());
  }
};

export default refresh;
