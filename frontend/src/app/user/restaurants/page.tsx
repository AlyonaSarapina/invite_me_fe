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

  const adjustedTotal = userStore.isOwner
    ? restaurantStore.totalCount + 1
    : restaurantStore.totalCount;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const syncParamsToStore = () => {
    const params = new URLSearchParams(searchParams);
    let shouldRedirect = false;

    let page = parseInt(params.get("page") || "1", 10);
    let name = params.get("name")?.toLowerCase() || "";
    let minRatingRaw = params.get("min_rating");
    let isPetFriendlyRaw = params.get("is_pet_friendly");
    let cuisineParam = params.get("cuisine");

    if (isNaN(page) || page < 1) {
      page = 1;
      params.set("page", "1");
      shouldRedirect = true;
    }

    let minRating = minRatingRaw ? parseInt(minRatingRaw) : null;
    if (
      minRating !== null &&
      (isNaN(minRating) || minRating < 0 || minRating > 5)
    ) {
      minRating = null;
      params.delete("min_rating");
      shouldRedirect = true;
    }

    let isPetFriendly: boolean | null = null;
    if (isPetFriendlyRaw === "true") isPetFriendly = true;
    else if (isPetFriendlyRaw === "false") isPetFriendly = false;
    else if (isPetFriendlyRaw !== null) {
      params.delete("is_pet_friendly");
      shouldRedirect = true;
    }

    const cuisinesFromParams = cuisineParam
      ? cuisineParam.split(",").filter(Boolean)
      : [];

    if (page !== currentPage) setCurrentPage(page);
    if (name !== filters.name) setNameFilter(name);
    if (minRating !== filters.minRating) setMinRatingFilter(minRating);
    if (isPetFriendly !== filters.isPetFriendly)
      setIsPetFriendlyFilter(isPetFriendly);
    if (cuisinesFromParams.join(",") !== filters.cuisines.join(","))
      setCuisinesFilter(cuisinesFromParams);

    if (shouldRedirect) {
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  useEffect(() => {
    const pageFromParams = parseInt(searchParams.get("page") || "1", 10);
    syncParamsToStore();

    if (!loading && adjustedTotal > 0) {
      const total = Math.ceil(adjustedTotal / restaurantsPerPage);
      const isInvalid =
        isNaN(pageFromParams) || pageFromParams < 1 || pageFromParams > total;

      if (isInvalid && currentPage !== 1) {
        router.replace(`${pathname}?page=1`);
      }
    }
  }, [searchParams, adjustedTotal, restaurantsPerPage, loading]);

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
                {restaurants.length === 0 && (
                  <div className="flex flex-column text-center">
                    <p>No restaurants found</p>
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
