import { types } from "mobx-state-tree";
import RestaurantModel from "./RestaurantModel";
import TableModel from "./TableModel";
import { UserModel } from "./UserModel";

const BookingModel = types.model("BookingModel", {
  id: types.identifierNumber,
  num_people: types.number,
  start_time: types.string,
  end_time: types.string,
  status: types.string,
  table: TableModel,
  client: UserModel,
});

export default BookingModel;
