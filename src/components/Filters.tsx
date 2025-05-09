"use client";

import React, { useCallback, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { updateQueryParam } from "@/utils/updateQuery";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/styles/FiltersLayout.module.css";
import { debounce } from "lodash";
import { useStore } from "@/stores/context";
import { Cuisine } from "@/types/enums";

const Filters: React.FC = () => {
  const { restaurantStore } = useStore();
  const {
    filters,
    setNameFilter,
    setCuisinesFilter,
    setMinRatingFilter,
    setIsPetFriendlyFilter,
  } = restaurantStore;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [localSearch, setLocalSearch] = useState(filters.name ?? "");

  const debouncedSearch = useMemo(
    () =>
      debounce((name: string) => {
        updateQueryParam("name", name, router, searchParams);
        setNameFilter(name);
      }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleFilterByPetFriendly = () => {
    const newPetFriendly = filters.isPetFriendly === true ? null : true;
    updateQueryParam("is_pet_friendly", newPetFriendly, router, searchParams);
    setIsPetFriendlyFilter(newPetFriendly);
  };

  const handleCuisineToggle = useCallback(
    (cuisine: string) => {
      const isSelected = filters.cuisines.includes(cuisine);
      const newCuisines = isSelected
        ? filters.cuisines.filter((c) => c !== cuisine)
        : [...filters.cuisines, cuisine];

      updateQueryParam("cuisine", newCuisines.join(","), router, searchParams);
      setCuisinesFilter(newCuisines);
    },
    [filters.cuisines, router, searchParams]
  );

  const handleFilterByMinRating = (minRating: number | null) => {
    updateQueryParam("min_rating", minRating, router, searchParams);
    setMinRatingFilter(minRating);
  };

  const handleResetFilters = () => {
    setNameFilter("");
    setCuisinesFilter([]);
    setMinRatingFilter(null);
    setIsPetFriendlyFilter(null);
    setLocalSearch("");

    updateQueryParam("name", "", router, searchParams);
    updateQueryParam("cuisine", "", router, searchParams);
    updateQueryParam("min_rating", "", router, searchParams);
    updateQueryParam("is_pet_friendly", null, router, searchParams);

    router.push("/client/restaurants", undefined);
  };

  return (
    <div className="mb-4">
      <form className="d-flex flex-grow-3">
        <div className="position-relative w-100">
          <input
            type="text"
            className={`form-control rounded-pill shadow-sm pe-5 text-muted ${styles.searchInput}`}
            value={localSearch}
            onChange={handleSearchChange}
          />
          <i
            className={`fa fa-search position-absolute ${styles.searchIcon}`}
          ></i>
        </div>
      </form>
      <label className="form-label">Rating</label>
      <select
        className="form-select mb-2"
        value={filters.minRating ?? ""}
        onChange={(e) =>
          handleFilterByMinRating(
            e.target.value ? parseInt(e.target.value) : null
          )
        }
      >
        <option value="">Any</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} Star{n > 1 ? "s" : ""}
          </option>
        ))}
      </select>
      <div className="form-check">
        <input
          checked={filters.isPetFriendly === true}
          type="checkbox"
          className="form-check-input"
          onChange={() => handleFilterByPetFriendly()}
        />
        <label className="form-check-label">Pet Friendly</label>
      </div>

      <div className="mt-3">
        <label className="form-label">Cuisine</label>
        <div className="d-flex flex-column">
          {Object.values(Cuisine).map((cuisine) => (
            <div key={cuisine} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`cuisine-${cuisine}`}
                checked={filters.cuisines.includes(cuisine)}
                onChange={() => handleCuisineToggle(cuisine)}
              />
              <label
                className="form-check-label"
                htmlFor={`cuisine-${cuisine}`}
              >
                {cuisine}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn btn-outline-secondary mt-3"
        onClick={handleResetFilters}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default observer(Filters);
