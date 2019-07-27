import { createSlice } from "redux-starter-kit";

/*
 * "route" slice
 * Stores the active route for the app.
 *
 * Format:
 * Just a string with the route. Eg: "/home", "/settings", etc.
 */

const ROUTES = {
  HOME: "/home",
  SETTINGS: "/settings",
  DROPBOX_FILE_PICKER: "/dropboxFilePicker"
};

const slice = createSlice({
  slice: "route",
  initialState: ROUTES.HOME,
  reducers: {
    set: (state, { payload: newRoute }) =>
      Object.values(ROUTES).includes(newRoute) ? newRoute : state
  }
});

slice.actions.goToHome = () => slice.actions.set(ROUTES.HOME);
slice.actions.goToSettings = () => slice.actions.set(ROUTES.SETTINGS);
slice.actions.goToDropboxFilePicker = () =>
  slice.actions.set(ROUTES.DROPBOX_FILE_PICKER);

slice.selectors = {
  currentRoute: state => state.route
};

slice.ROUTES = ROUTES;

export default slice;
