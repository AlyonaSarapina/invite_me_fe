import { TableDetails } from "./TableDetails";
import { UserDetails } from "./UserDetails";

export type BookingCard = {
  id: number;
  num_people: number;
  start_time: string;
  end_time: string;
  status: string;
  table: TableDetails;
  client: UserDetails;
};
