import { Instance, cast, flow, types } from "mobx-state-tree";
import { api } from "@/utils/axios";
import RestaurantModel from "./models/RestaurantModel";
import FiltersModel from "./models/FiltersModel";

export const RestaurantStore = types
  .model("RestaurantStore", {
    restaurants: types.optional(types.array(RestaurantModel), []),
    totalCount: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    filters: types.optional(FiltersModel, {}),
    loading: types.optional(types.boolean, false),
    restaurantsPerPage: types.optional(types.number, 4),
    error: types.maybeNull(types.string),
  })
  .actions((self) => {
    const fetchRestaurants = flow(function* (isOwner = false) {
      self.loading = true;
      try {
        const { currentPage, filters, restaurantsPerPage } = self;
        const limit = isOwner ? restaurantsPerPage - 1 : restaurantsPerPage;

        const offset = isOwner
          ? (currentPage - 1) * (restaurantsPerPage - 1)
          : (currentPage - 1) * restaurantsPerPage;

        const query = new URLSearchParams();

        if (filters.name) query.set("name", filters.name);
        if (filters.minRating)
          query.set("min_rating", filters.minRating.toString());
        if (filters.cuisines?.length)
          query.set("cuisine", filters.cuisines.join(","));
        if (filters.isPetFriendly != null)
          query.set("is_pet_friendly", String(filters.isPetFriendly));

        query.set("offset", offset.toString());
        query.set("limit", limit.toString());

        const res = yield api.get(`/restaurants?${query.toString()}`);

        self.restaurants = Array.isArray(res.data.data)
          ? cast(res.data.data)
          : cast([]);
        self.totalCount = res.data.total;
      } catch (err: any) {
        console.error("Failed to fetch restaurants", err);
        self.error =
          err?.response?.data?.message || "Failed to fetch restaurants";
      } finally {
        self.loading = false;
      }
    });

    const fetchRestaurantById = flow(function* (id: string, isOwner = false) {
      self.loading = true;
      try {
        const endpoint = isOwner
          ? `/restaurants/my/${id}`
          : `/restaurants/${id}`;
        const res = yield api.get(endpoint);
        return res.data;
      } catch (err: any) {
        console.error("Failed to fetch restaurant", err);
        self.error =
          err?.response?.data?.message || "Failed to fetch restaurant";
      } finally {
        self.loading = false;
      }
    });

    const createRestaurant = flow(function* (data: any) {
      self.loading = true;
      try {
        console.log(data);
        const res = yield api.post("/restaurants", data);
        console.log(res.data);
      } catch (err) {
        console.error("Failed to create restaurant", err);
      } finally {
        self.loading = false;
      }
    });

    const updateRestaurant = flow(function* (restaurantId: number, data: any) {
      self.loading = true;
      try {
        const res = yield api.patch(`/restaurants/${restaurantId}`, data);
      } catch (err) {
        console.error("Failed to create restaurant", err);
      } finally {
        self.loading = false;
      }
    });

    const uploadFile = flow(function* (
      file: File,
      onProgress?: (progress: number) => void,
      id?: number
    ) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const query = new URLSearchParams();

        if (file.type.split("/")[0] === "image") {
          query.set("type", "logo");
        }

        if (file.type === "application/pdf") {
          query.set("type", "menu");
        }
        const res = yield api.patch(
          `restaurants/${id}/file?${query}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              );
              onProgress?.(percent);
            },
          }
        );

        return res.data;
      } catch (err) {
        console.error("Failed to upload logo picture:", err);
        throw err;
      }
    });

    const deleteRestaurant = flow(function* (id: number) {
      self.loading = true;
      try {
        const res = yield api.delete(`/restaurants/${id}`);
        fetchRestaurants();
      } catch (err) {
        console.error("Failed to delete restaurant", err);
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
      self.filters.cuisines = cast(newCuisines);
    };

    const resetFilters = () => {
      self.filters.name = "";
      self.filters.minRating = null;
      self.filters.isPetFriendly = null;
      self.filters.cuisines.clear();
    };

    return {
      fetchRestaurants,
      setCurrentPage,
      setNameFilter,
      setMinRatingFilter,
      setIsPetFriendlyFilter,
      setCuisinesFilter,
      fetchRestaurantById,
      updateRestaurant,
      createRestaurant,
      uploadFile,
      deleteRestaurant,
      resetFilters,
    };
  });

export interface IRestaurantStore extends Instance<typeof RestaurantStore> {}
export const restaurantStore = RestaurantStore.create({});
