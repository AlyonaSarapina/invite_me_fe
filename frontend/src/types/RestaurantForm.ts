export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export type OperatingHours = {
  [key in (typeof daysOfWeek)[number]]: {
    open: string;
    close: string;
  };
};

export type FormState = {
  name: string;
  description: string;
  address: string;
  email: string;
  operating_hours: OperatingHours;
  booking_duration: number;
  tables_capacity: number;
  cuisine: string;
  phone: string;
  inst_url: string;
  rating: number;
  is_pet_friendly: boolean;
};
