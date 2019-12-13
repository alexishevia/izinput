/*
 * The reducerVersion slice basically keeps track of whenever a breaking change
 * is made to the reducer. When that happens, we want to re-run reduxFileSync,
 * and reprocess all events.
 */

import { createSlice } from "redux-starter-kit";

const initialState = "";
const latestVersion = "201912121810"; // Update this value to trigger a full reprocessing

const reducerVersion = createSlice({
  slice: "reducerVersion",
  initialState,
  reducers: {
    update: () => latestVersion
  }
});

reducerVersion.selectors = {
  isUpToDate: state => state[reducerVersion.slice] === latestVersion
};

export default reducerVersion;
