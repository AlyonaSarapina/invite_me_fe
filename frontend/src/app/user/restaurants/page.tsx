"use client";

import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/context";
import RestaurantCard from "@/components/RestaurantCard";
import { useSearchParams } from "next/navigation";
import Filters from "@/components/Filters";
import PaginationControls from "@/components/Pagination";

const RESTAURANTS_PER_PAGE = 10;

function RestaurantsList() {
  const { restaurantStore, userStore } = useStore();
  const {
    filters,
    restaurants,
    fetchRestaurants,
    currentPage,
    setNameFilter,
    setCurrentPage,
    setMinRatingFilter,
    setIsPetFriendlyFilter,
    setCuisinesFilter,
  } = restaurantStore;
  const searchParams = useSearchParams();

  const syncParamsToStore = () => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const name = searchParams.get("name")?.toLowerCase() || "";
    const minRating = searchParams.get("min_rating");
    const isPetFriendly = searchParams.get("is_pet_friendly");
    const cuisineParam = searchParams.get("cuisine");

    setCurrentPage(page);
    setNameFilter(name);
    setMinRatingFilter(minRating ? parseInt(minRating) : null);
    setIsPetFriendlyFilter(isPetFriendly === "true" ? true : null);
    setCuisinesFilter(
      cuisineParam ? cuisineParam.split(",").filter(Boolean) : []
    );
  };

  useEffect(() => {
    syncParamsToStore();
  }, [searchParams]);

  useEffect(() => {
    if (userStore.user) {
      fetchRestaurants();
    }
  }, [
    userStore.user,
    filters.name,
    filters.minRating,
    filters.isPetFriendly,
    filters.cuisines.join(","),
    currentPage,
  ]);

  const startIdx = (currentPage - 1) * RESTAURANTS_PER_PAGE;
  const paginatedRestaurants = restaurants.slice(
    startIdx,
    startIdx + RESTAURANTS_PER_PAGE
  );

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold text-light text-stroke text-outline-dark">
        Explore Restaurants
      </h2>
      <div className="row">
        <div className="mb-4">
          <div className="d-md-block">
            <Filters />
          </div>
        </div>
        <div className="col-12">
          <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
            {paginatedRestaurants.map((restaurant) => (
              <div className="col" key={restaurant.id}>
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
            <PaginationControls
              totalItems={restaurants.length}
              itemsPerPage={RESTAURANTS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(RestaurantsList);
