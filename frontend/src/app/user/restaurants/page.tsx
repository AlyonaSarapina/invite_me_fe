"use client";

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Skeleton from "react-loading-skeleton";
import { useStore } from "@/stores/context";
import RestaurantCard from "@/components/RestaurantCard";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Filters from "@/components/Filters";
import PaginationControls from "@/components/Pagination";
import CreateRestaurantCard from "@/components/CreateRestaurantCard";
import RestaurantCreateModal from "@/components/RestaurantModal";
import { Instance } from "mobx-state-tree";
import RestaurantModel from "@/stores/models/RestaurantModel";

const RestaurantsList = () => {
  const { restaurantStore, userStore } = useStore();
  const {
    filters,
    loading,
    restaurants,
    restaurantsPerPage,
    fetchRestaurants,
    currentPage,
    setNameFilter,
    setCurrentPage,
    setMinRatingFilter,
    setIsPetFriendlyFilter,
    setCuisinesFilter,
  } = restaurantStore;
  const searchParams = useSearchParams();
  const [restaurantToEdit, setRestaurantToEdit] = useState<
    Instance<typeof RestaurantModel> | undefined
  >(undefined);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const syncParamsToStore = () => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const name = searchParams.get("name")?.toLowerCase() || "";
    const minRating = searchParams.get("min_rating");
    const isPetFriendly = searchParams.get("is_pet_friendly");
    const cuisineParam = searchParams.get("cuisine");

    if (page !== currentPage) setCurrentPage(page);
    if (name !== filters.name) setNameFilter(name);
    if ((minRating ? parseInt(minRating) : null) !== filters.minRating)
      setMinRatingFilter(minRating ? parseInt(minRating) : null);
    if ((isPetFriendly === "true" ? true : null) !== filters.isPetFriendly)
      setIsPetFriendlyFilter(isPetFriendly === "true" ? true : null);

    const cuisinesFromParams = cuisineParam
      ? cuisineParam.split(",").filter(Boolean)
      : [];

    if (cuisinesFromParams.join(",") !== filters.cuisines.join(",")) {
      setCuisinesFilter(cuisinesFromParams);
    }
  };

  useEffect(() => {
    syncParamsToStore();
  }, [searchParams]);

  useEffect(() => {
    if (userStore.user) {
      if (userStore.isOwner) {
        fetchRestaurants(true);
      } else {
        fetchRestaurants();
      }
    }
  }, [
    userStore.user,
    filters.name,
    filters.minRating,
    filters.isPetFriendly,
    filters.cuisines.join(","),
    currentPage,
  ]);

  const adjustedTotal = userStore.isOwner
    ? restaurantStore.totalCount + 1
    : restaurantStore.totalCount;

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
            {loading ? (
              Array.from({ length: restaurantsPerPage }).map((_, index) => (
                <div className="col" key={index}>
                  <Skeleton height={300} duration={2} />
                </div>
              ))
            ) : (
              <>
                {userStore.isOwner && currentPage === 1 && (
                  <div className="col">
                    <CreateRestaurantCard onClick={() => setShowModal(true)} />
                  </div>
                )}
                {restaurants.map((restaurant) => (
                  <div className="col" key={restaurant.id}>
                    <RestaurantCard
                      setRestaurantToEdit={setRestaurantToEdit}
                      setShowModal={setShowModal}
                      restaurant={restaurant}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
          <RestaurantCreateModal
            show={showModal}
            onClose={() => {
              setShowModal(false);
              setRestaurantToEdit(undefined);
            }}
            restaurantToEdit={restaurantToEdit}
          />
        </div>
      </div>
      <PaginationControls
        totalItems={adjustedTotal}
        itemsPerPage={restaurantsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default observer(RestaurantsList);
