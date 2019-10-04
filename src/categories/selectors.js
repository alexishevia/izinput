/* eslint import/prefer-default-export:[0] */

import { createSelector } from "reselect";
import { categories as categoriesSlice } from "izreducer";

export const sortedCategories = createSelector(
  [categoriesSlice.selectors.all],
  categories => categories.sort()
);
