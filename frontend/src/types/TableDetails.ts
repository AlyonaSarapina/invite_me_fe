import { RestaurantDetails } from "./RestaurantDetails";

export type TableDetails = {
  id: number;
  table_number: number;
  table_capacity: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  restaurant: RestaurantDetails;
};
