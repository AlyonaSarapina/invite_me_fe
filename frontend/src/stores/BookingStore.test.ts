import { BookingStore } from "@/stores/BookingStore";
import { BookingStatus, SortDate } from "@/types/enums";
import { api } from "@/utils/axios";

jest.mock("@/utils/axios");
const mockedApi = api as jest.Mocked<typeof api>;

describe("BookingStore", () => {
  let store: ReturnType<typeof BookingStore.create>;

  beforeEach(() => {
    store = BookingStore.create({});
    jest.clearAllMocks();
  });

  it("fetches bookings and sets state correctly", async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            status: "confirmed",
            restaurantName: "Test",
            clientName: "User",
          },
        ],
        confirmed: 1,
        total: 1,
        restaurantNamesList: ["Test"],
      },
    });

    await store.fetchBookings();

    expect(mockedApi.get).toHaveBeenCalled();
    expect(store.bookings.length).toBe(1);
    expect(store.confirmed).toBe(1);
    expect(store.totalCount).toBe(1);
    expect(store.allRestaurants).toContain("Test");
  });

  it("sets sort order and fetches bookings", async () => {
    const spy = jest.spyOn(store, "fetchBookings");
    store.setSortOrder(SortDate.OLDEST);
    expect(store.sortOrder).toBe(SortDate.OLDEST);
    expect(spy).toHaveBeenCalled();
  });

  it("sets status filter and fetches bookings", async () => {
    const spy = jest.spyOn(store, "fetchBookings");
    store.setStatusFilter(BookingStatus.CONFIRMED);
    expect(store.statusFilter).toBe(BookingStatus.CONFIRMED);
    expect(spy).toHaveBeenCalled();
  });

  it("sets restaurant filter and fetches bookings", async () => {
    const spy = jest.spyOn(store, "fetchBookings");
    store.setRestaurantFilter("Testaurant");
    expect(store.restaurantFilter).toBe("Testaurant");
    expect(spy).toHaveBeenCalled();
  });

  it("sets current page and fetches bookings", async () => {
    const spy = jest.spyOn(store, "fetchBookings");
    store.setCurrentPage(3);
    expect(store.currentPage).toBe(3);
    expect(spy).toHaveBeenCalled();
  });

  it("fetches available slots", async () => {
    mockedApi.post.mockResolvedValue({ data: ["18:00", "18:30"] });
    await store.fetchAvailableSlots(1, "2025-06-01", 2, "18:00");

    expect(mockedApi.post).toHaveBeenCalled();
    expect(store.availableSlots).toContain("18:30");
  });

  it("creates a booking", async () => {
    mockedApi.post.mockResolvedValue({ data: { success: true } });

    const result = await store.createBooking(1, {
      num_people: 2,
      start_time: "18:00",
    });

    expect(mockedApi.post).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it("cancels a booking", async () => {
    mockedApi.delete.mockResolvedValue({ data: { cancelled: true } });

    const result = await store.cancelBooking(1);

    expect(mockedApi.delete).toHaveBeenCalledWith("/bookings/1");
    expect(result).toEqual({ cancelled: true });
  });

  it("clears available slots", () => {
    store.availableSlots.replace(["18:00", "18:30"]);
    store.clearSlots();
    expect(store.availableSlots.length).toBe(0);
  });

  it("resets filters", () => {
    store.setStatusFilter(BookingStatus.CONFIRMED);
    store.setRestaurantFilter("Resto");
    store.setSortOrder(SortDate.OLDEST);

    store.resetFilters();

    expect(store.statusFilter).toBe("all");
    expect(store.restaurantFilter).toBe("all");
    expect(store.sortOrder).toBe(SortDate.NEWEST);
  });
});
