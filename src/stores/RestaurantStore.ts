import { Instance, flow, types } from "mobx-state-tree";
import { api } from "@/utils/axios";
import RestaurantModel from "./models/RestaurantModel";

export const RestaurantStore = types
  .model("RestaurantStore", {
    restaurants: types.array(RestaurantModel),
    totalCount: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    filters: types.optional(types.frozen(), {}),
    loading: types.optional(types.boolean, false),
  })
  .actions((self) => {
    const fetchRestaurants = flow(function* () {
      self.loading = true;
      try {
        const { currentPage, filters } = self;
        const limit = 10;
        const offset = (currentPage - 1) * limit;

        const query = new URLSearchParams({
          ...filters,
          limit,
          offset,
        } as any).toString();
        const res = yield api.get(`/restaurants?${query}`);
        console.log(res.data.data);
        self.restaurants = res.data.data;
        self.totalCount = res.data.total;
      } catch (err) {
        console.error("Failed to fetch restaurants", err);
      } finally {
        self.loading = false;
      }
    });

    const setCurrentPage = (page: number) => {
      self.currentPage = page;
    };

    const setFilters = (newFilters: any) => {
      self.filters = newFilters;
      self.currentPage = 1;
    };

    return { fetchRestaurants, setCurrentPage, setFilters };
  });

export interface IRestaurantStore extends Instance<typeof RestaurantStore> {}
export const restaurantStore = RestaurantStore.create({});
