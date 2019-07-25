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
  SETTINGS: "/settings"
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

slice.selectors = {
  atHome: state => state.route === ROUTES.HOME,
  atSettings: state => state.route === ROUTES.SETTINGS
};

export default slice;
