"use client";

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/context";
import RestaurantCard from "@/components/RestaurantCard";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Paginations";
import Filters from "@/components/Filters";

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
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [
    filters.name,
    filters.minRating,
    filters.isPetFriendly,
    filters.cuisines.join(","),
    currentPage,
  ]);

  // const handlePageClick = (page: number) => {
  //   if (page !== currentPage) {
  //     const current = new URLSearchParams(Array.from(searchParams.entries()));
  //     current.set("page", String(page));
  //     router.push(`/user/restaurants?${current.toString()}`);
  //   }
  // };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="mb-4 p-3 rounded">
          <div className="d-md-block">
            <Filters />
          </div>
        </div>
        <div className="col-12 col-md-9 ps-md-4">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {restaurants.map((restaurant) => (
              <div className="col" key={restaurant.id}>
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>
          {/* <div className="d-flex justify-content-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalItems={totalCount}
              itemsPerPage={10}
              onPageChange={handlePageClick}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default observer(RestaurantsList);
