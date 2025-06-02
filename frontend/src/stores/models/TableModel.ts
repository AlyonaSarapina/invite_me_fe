import { types } from "mobx-state-tree";
import RestaurantModel from "./RestaurantModel";

const TableModel = types.model("TableModel", {
  id: types.identifierNumber,
  table_number: types.number,
  table_capacity: types.number,
  created_at: types.string,
  updated_at: types.string,
  deleted_at: types.maybeNull(types.string),
  restaurant: types.maybeNull(RestaurantModel),
});

export default TableModel;
