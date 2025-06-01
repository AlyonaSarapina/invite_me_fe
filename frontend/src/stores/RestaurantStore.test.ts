import { restaurantStore } from "@/stores/RestaurantStore";
import { api } from "@/utils/axios";
import { when } from "mobx";
import { cast } from "mobx-state-tree";
import { mocked } from "jest-mock";

jest.mock("@/utils/axios", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("RestaurantStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    restaurantStore.restaurants = cast([]);
    restaurantStore.totalCount = 0;
    restaurantStore.currentPage = 1;
    restaurantStore.filters = cast({
      name: null,
      minRating: null,
      isPetFriendly: null,
      cuisines: [],
    });
    restaurantStore.error = null;
  });

  test("fetchRestaurants should fetch data and set restaurants", async () => {
    const mockData = {
      data: [
        {
          id: 1,
          name: "Test",
          address: "123 Street",
          email: "test@example.com",
          operating_hours: {},
          booking_duration: 1,
          tables_capacity: 5,
          cuisine: "Italian",
          logo_url: null,
          menu_url: null,
          phone: "123",
          inst_url: "insta",
          rating: "4.5",
          is_pet_friendly: true,
          created_at: "",
          updated_at: "",
          deleted_at: null,
        },
      ],
      total: 1,
    };
    mocked(api.get).mockResolvedValue({ data: mockData });

    const promise = restaurantStore.fetchRestaurants();
    await when(() => !restaurantStore.loading);
    await promise;

    expect(restaurantStore.restaurants.length).toBe(1);
    expect(restaurantStore.totalCount).toBe(1);
    expect(api.get).toHaveBeenCalled();
  });

  test("fetchRestaurantById should return restaurant", async () => {
    const mockRestaurant = {
      id: 1,
      name: "Test",
      address: "123 Street",
      email: "test@example.com",
      operating_hours: {},
      booking_duration: 1,
      tables_capacity: 5,
      cuisine: "Italian",
      logo_url: null,
      menu_url: null,
      phone: "123",
      inst_url: "insta",
      rating: "4.5",
      is_pet_friendly: true,
      created_at: "",
      updated_at: "",
      deleted_at: null,
    };
    mocked(api.get).mockResolvedValue({ data: mockRestaurant });

    const res = await restaurantStore.fetchRestaurantById("1");

    expect(res).toEqual(mockRestaurant);
    expect(api.get).toHaveBeenCalledWith("/restaurants/1");
  });

  test("createRestaurant should call POST API", async () => {
    const mockData = { name: "New" };
    mocked(api.post).mockResolvedValue({ data: {} });

    await restaurantStore.createRestaurant(mockData);

    expect(api.post).toHaveBeenCalledWith("/restaurants", mockData);
  });

  test("updateRestaurant should call PATCH API", async () => {
    const mockData = { name: "Updated" };
    mocked(api.patch).mockResolvedValue({ data: {} });

    await restaurantStore.updateRestaurant(1, mockData);

    expect(api.patch).toHaveBeenCalledWith("/restaurants/1", mockData);
  });

  test("uploadFile should call PATCH API with FormData", async () => {
    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    const mockResponse = { url: "image_url" };
    mocked(api.patch).mockResolvedValue({ data: mockResponse });

    const res = await restaurantStore.uploadFile(file, undefined, 1);

    expect(res).toEqual(mockResponse);
    expect(api.patch).toHaveBeenCalled();
  });

  test("deleteRestaurant should call DELETE API", async () => {
    mocked(api.delete).mockResolvedValue({});
    mocked(api.get).mockResolvedValue({ data: { data: [], total: 0 } });

    await restaurantStore.deleteRestaurant(1);

    expect(api.delete).toHaveBeenCalledWith("/restaurants/1");
  });

  test("setCurrentPage sets the page", () => {
    restaurantStore.setCurrentPage(5);
    expect(restaurantStore.currentPage).toBe(5);
  });

  test("setNameFilter sets name filter", () => {
    restaurantStore.setNameFilter("Sushi");
    expect(restaurantStore.filters.name).toBe("Sushi");
  });

  test("setMinRatingFilter sets rating filter", () => {
    restaurantStore.setMinRatingFilter(4);
    expect(restaurantStore.filters.minRating).toBe(4);
  });

  test("setIsPetFriendlyFilter sets pet friendly", () => {
    restaurantStore.setIsPetFriendlyFilter(true);
    expect(restaurantStore.filters.isPetFriendly).toBe(true);
  });

  test("setCuisinesFilter sets cuisines", () => {
    restaurantStore.setCuisinesFilter(["Italian", "Chinese"]);
    expect(restaurantStore.filters.cuisines).toEqual(["Italian", "Chinese"]);
  });
});
