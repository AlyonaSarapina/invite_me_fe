"use client";

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/context";
import RestaurantCard from "@/components/RestaurantCard";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Paginations";
import Filters from "@/components/Filters";
import styles from "@/styles/RestaurantsPage.module.css";

function RestaurantsList() {
  const { restaurantStore, userStore } = useStore();
  const {
    filters,
    restaurants,
    fetchRestaurants,
    currentPage,
    setNameFilter,
    setCurrentPage,
  } = restaurantStore;
  const { isClient } = userStore;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const syncParamsToStore = () => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const name = searchParams.get("name")?.toLowerCase() || "";

    setNameFilter(name);
    setCurrentPage(page);
  };

  useEffect(() => {
    syncParamsToStore();
  }, []);

  useEffect(() => {
    if (isClient) {
      fetchRestaurants();
    } else {
      router.push("/");
    }
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
  //     router.push(`/client/restaurants?${current.toString()}`);
  //   }
  // };

  return (
    <div className="container py-5">
      <button
        className="btn btn-outline-secondary d-md-none"
        onClick={toggleFilters}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="row">
        <div className="col-md-3 mb-4 border-end bg-light p-3 rounded">
          <div className="d-none d-md-block">
            <Filters />
          </div>
          {showFilters && (
            <div className={`d-md-none mt-3 ${styles.mobileFilterOverlay}`}>
              <Filters />
              <button
                className="btn btn-outline-secondary mb-3"
                onClick={toggleFilters}
              >
                Close Filters
              </button>
            </div>
          )}
        </div>
        <div className="col-md-9 ps-md-4">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
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
