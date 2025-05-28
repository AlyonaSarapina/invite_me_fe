import { types, flow, Instance, cast } from "mobx-state-tree";
import { api } from "@/utils/axios";
import BookingModel from "./models/BookingModel";
import { BookingStatus, SortDate } from "@/types/enums";

export const BookingStore = types
  .model("BookingStore", {
    bookings: types.optional(types.array(BookingModel), []),
    availableSlots: types.optional(types.array(types.string), []),
    confirmed: types.optional(types.number, 0),
    totalCount: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    bookingsPerPage: types.optional(types.number, 5),
    loading: types.optional(types.boolean, false),
    statusFilter: types.optional(
      types.enumeration([...Object.values(BookingStatus), "all"]),
      "all"
    ),
    restaurantFilter: types.optional(types.string, "all"),
    allRestaurants: types.optional(types.array(types.string), []),
    allStatuses: types.optional(
      types.array(types.enumeration(Object.values(BookingStatus))),
      Object.values(BookingStatus)
    ),
    sortOrder: types.optional(
      types.enumeration([...Object.values(SortDate)]),
      SortDate.NEWEST
    ),
    error: types.maybeNull(types.string),
  })
  .actions((self) => {
    const fetchBookings = flow(function* () {
      self.loading = true;
      try {
        const limit = self.bookingsPerPage;
        const offset = (self.currentPage - 1) * limit;

        const query = new URLSearchParams();

        query.set("offset", offset.toString());
        query.set("limit", limit.toString());

        if (self.statusFilter !== "all") query.set("status", self.statusFilter);
        if (self.restaurantFilter !== "all")
          query.set("restaurantName", self.restaurantFilter);
        if (self.sortOrder) query.set("sortOrder", self.sortOrder);

        const res = yield api.get(`/bookings?${query.toString()}`);

        self.bookings = cast(res.data.data);
        self.confirmed = res.data.confirmed;
        self.totalCount = res.data.total;
        self.allRestaurants = res.data.restaurantNamesList;
      } catch (error: any) {
        self.error =
          error?.response?.data?.message || "Failed to fetch bookings";
      } finally {
        self.loading = false;
      }
    });

    const setSortOrder = (order: SortDate) => {
      self.sortOrder = order;
      self.currentPage = 1;
      fetchBookings();
    };

    const setStatusFilter = (status: BookingStatus | "all") => {
      self.statusFilter = status;
      self.currentPage = 1;
      fetchBookings();
    };

    const setRestaurantFilter = (restaurant: string) => {
      self.restaurantFilter = restaurant;
      self.currentPage = 1;
      fetchBookings();
    };

    const setCurrentPage = (page: number) => {
      self.currentPage = page;
      fetchBookings();
    };

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
          { date, num_people, start_time }
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
        if (data.clientPhoneNumber?.trim()) {
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
        return res.data;
      } catch (error: any) {
        self.error =
          error?.response?.data?.message || "Failed to cancel booking";
      } finally {
        self.loading = false;
      }
    });

    const clearSlots = () => {
      self.availableSlots.clear();
    };

    const resetFilters = () => {
      self.statusFilter = "all";
      self.restaurantFilter = "all";
      self.sortOrder = SortDate.NEWEST;
      self.currentPage = 1;
    };

    return {
      fetchBookings,
      fetchAvailableSlots,
      createBooking,
      cancelBooking,
      clearSlots,
      setSortOrder,
      setStatusFilter,
      setRestaurantFilter,
      setCurrentPage,
      resetFilters,
    };
  });

export interface IBookingStore extends Instance<typeof BookingStore> {}
export const bookingStore = BookingStore.create({});
