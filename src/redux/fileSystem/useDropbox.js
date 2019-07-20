import loading from "../loading";
import errors from "../errors";
import Dropbox from "../../Dropbox";

// useDropbox() triggers the dropbox login process
const useDropbox = async ({ dispatch, getState, mount }) => {
  const state = getState();

  if (loading.selectors.isLoading(state)) {
    return;
  }

  dispatch(loading.actions.start());

  try {
    const accessToken = await Dropbox.login();
    dispatch(mount({ type: "dropbox", accessToken }));
  } catch (err) {
    dispatch(
      errors.actions.push({ error: err, description: "logging into Dropbox" })
    );
  } finally {
    dispatch(loading.actions.stop());
  }
};

export default useDropbox;
