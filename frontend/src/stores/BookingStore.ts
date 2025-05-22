import { types, flow, Instance, cast } from "mobx-state-tree";
import { api } from "@/utils/axios";
import BookingModel from "./models/BookingModel";

export const BookingStore = types
  .model("BookingStore", {
    bookings: types.optional(types.array(BookingModel), []),
    availableSlots: types.optional(types.array(types.string), []),
    loading: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
  })
  .actions((self) => {
    const fetchBookings = flow(function* () {
      self.loading = true;
      try {
        const res = yield api.get("/bookings");
        self.bookings = cast(res.data);
      } catch (error: any) {
        self.error =
          error?.response?.data?.message || "Failed to fetch bookings";
      } finally {
        self.loading = false;
      }
    });

    const fetchAvailableSlots = flow(function* (
      restaurantId: number,
      date: string,
      num_people: number,
      start_time: string
    ) {
      self.loading = true;
      self.error = null;

      try {
        const response = yield api.post(
          `/bookings/${restaurantId}/available-slots`,
          {
            date,
            num_people,
            start_time,
          }
        );

        self.availableSlots = response.data;
      } catch (error: any) {
        self.error = error?.response?.data?.message || "Failed to fetch slots";
      } finally {
        self.loading = false;
      }
    });

    const createBooking = flow(function* (
      restaurantId: number,
      data: {
        num_people: number;
        start_time: string;
        clientPhoneNumber?: string;
      }
    ) {
      self.loading = true;
      self.error = null;

      try {
        const payload: Record<string, any> = {
          num_people: data.num_people,
          start_time: data.start_time,
        };

        if (data.clientPhoneNumber && data.clientPhoneNumber.trim() !== "") {
          payload.clientPhoneNumber = data.clientPhoneNumber;
        }

        const response = yield api.post(
          `/bookings/${restaurantId}/book`,
          payload
        );

        return response.data;
      } catch (error: any) {
        self.error = error?.response?.data?.message || "Booking failed";
        return null;
      } finally {
        self.loading = false;
      }
    });

    const cancelBooking = flow(function* (bookingId: number) {
      self.loading = true;
      try {
        const res = yield api.delete(`/bookings/${bookingId}`);
        console.log(res.data);
        return res.data;
      } catch (error: any) {
        self.error =
          error?.response?.data?.message || "Failed to fetch bookings";
      } finally {
        self.loading = false;
      }
    });

    const clearSlots = () => {
      self.availableSlots.clear();
    };

    return {
      fetchAvailableSlots,
      createBooking,
      clearSlots,
      fetchBookings,
      cancelBooking,
    };
  });

export interface IBookingStore extends Instance<typeof BookingStore> {}
export const bookingStore = BookingStore.create({});
