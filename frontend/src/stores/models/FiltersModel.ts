import { types } from "mobx-state-tree";

const FiltersModel = types.model("FiltersModel", {
  name: types.maybeNull(types.string),
  minRating: types.maybeNull(types.number),
  isPetFriendly: types.maybeNull(types.boolean),
  cuisines: types.optional(types.array(types.string), []),
});

export default FiltersModel;
