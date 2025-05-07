"use client";

import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/context";
import RestaurantCard from "@/components/RestaurantCard";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import { useRouter, useSearchParams } from "next/navigation";

function RestaurantsPage() {
  const { restaurantStore, userStore } = useStore();
  const { restaurants, fetchRestaurants } = restaurantStore;
  const { isClient } = userStore;

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 fw-bold">Explore Restaurants</h2>
      {/* 
      {userStore.isClient && <Filters onFilterChange={handleFilterChange} />} */}

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
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div> */}
    </div>
  );
}

export default observer(RestaurantsPage);
