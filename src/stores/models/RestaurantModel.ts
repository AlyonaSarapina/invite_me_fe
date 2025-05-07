import { types } from "mobx-state-tree";

// Define your Restaurant model
const RestaurantModel = types.model("Restaurant", {
  id: types.identifierNumber,
  name: types.string,
  description: types.string,
  address: types.string,
  email: types.string,
  operating_hours: types.frozen(),
  booking_duration: types.number,
  tables_capacity: types.number,
  cuisine: types.string,
  logo_url: types.optional(types.string, ""),
  menu_url: types.optional(types.string, ""),
  phone: types.string,
  inst_url: types.string,
  rating: types.optional(types.string, ""),
  is_pet_friendly: types.boolean,
  created_at: types.string,
  updated_at: types.string,
  deleted_at: types.maybeNull(types.string),
});

export default RestaurantModel;
