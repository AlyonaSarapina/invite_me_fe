import { Instance, flow, types } from "mobx-state-tree";
import { api } from "@/utils/axios";
import RestaurantModel from "./models/RestaurantModel";
import FiltersModel from "./models/FiltersModel";

export const RestaurantStore = types
  .model("RestaurantStore", {
    restaurants: types.array(RestaurantModel),
    totalCount: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    filters: types.optional(FiltersModel, {}),
    loading: types.optional(types.boolean, false),
  })
  .actions((self) => {
    const fetchRestaurants = flow(function* () {
      self.loading = true;
      try {
        const { currentPage, filters } = self;
        const limit = 10;
        const offset = (currentPage - 1) * limit;

        const query = new URLSearchParams();

        if (filters.name) {
          query.set("name", filters.name);
        }

        if (filters.minRating) {
          query.set("min_rating", filters.minRating.toString());
        }

        if (filters.cuisines && filters.cuisines.length > 0) {
          query.set("cuisine", filters.cuisines.join(","));
        }

        if (filters.isPetFriendly) {
          query.set("is_pet_friendly", String(filters.isPetFriendly));
        }

        query.set("offset", offset.toString());
        query.set("limit", limit.toString());

        const res = yield api.get(`/restaurants?${query.toString()}`);
        self.restaurants = res.data.data;
        self.totalCount = res.data.total;
      } catch (err) {
        console.error("Failed to fetch restaurants", err);
      } finally {
        self.loading = false;
      }
    });

    const fetchRestaurantById = flow(function* (id: string) {
      self.loading = true;
      try {
        const res = yield api.get(`/restaurants/${id}`);
        return res.data;
      } catch (err) {
        console.error("Failed to fetch restaurant", err);
        return null;
      } finally {
        self.loading = false;
      }
    });

    const setCurrentPage = (page: number) => {
      self.currentPage = page;
    };

    const setNameFilter = (name: string) => {
      self.filters.name = name;
    };

    const setMinRatingFilter = (rating: number | null) => {
      self.filters.minRating = rating;
    };

    const setIsPetFriendlyFilter = (isPetFriendly: boolean | null) => {
      self.filters.isPetFriendly = isPetFriendly;
    };

    const setCuisinesFilter = (newCuisines: Array<string>) => {
      self.filters.cuisines.clear();
      newCuisines.forEach((cuisine) => self.filters.cuisines.push(cuisine));
    };

    return {
      fetchRestaurants,
      setCurrentPage,
      setNameFilter,
      setMinRatingFilter,
      setIsPetFriendlyFilter,
      setCuisinesFilter,
      fetchRestaurantById,
    };
  });

export interface IRestaurantStore extends Instance<typeof RestaurantStore> {}
export const restaurantStore = RestaurantStore.create({});
