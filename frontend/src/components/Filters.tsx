"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { observer } from "mobx-react-lite";
import { updateQueryParam } from "@/utils/updateQuery";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { useStore } from "@/stores/context";
import { Cuisine } from "@/types/enums";
import styles from "@/styles/Filters.module.css";

const Filters: React.FC = () => {
  const { restaurantStore } = useStore();
  const [showFilters, setShowFilters] = useState(false);
  const [showCuisines, setShowCuisines] = useState(false);
  const {
    filters,
    setNameFilter,
    setCuisinesFilter,
    setMinRatingFilter,
    setIsPetFriendlyFilter,
    setCurrentPage,
  } = restaurantStore;
  const router = useRouter();
  const [localSearch, setLocalSearch] = useState(filters.name ?? "");
  const filterRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLocalSearch(filters.name ?? "");
  }, [filters.name]);

  const debouncedSearch = useMemo(
    () =>
      debounce((name: string) => {
        updateQueryParam("name", name, router);
        setNameFilter(name);
      }, 300),
    []
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false); // Close the filter
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleFilterByPetFriendly = () => {
    const newPetFriendly = filters.isPetFriendly === true ? null : true;
    updateQueryParam("is_pet_friendly", newPetFriendly, router);
    setIsPetFriendlyFilter(newPetFriendly);
  };

  const handleCuisineToggle = useCallback(
    (cuisine: string) => {
      const isSelected = filters.cuisines.includes(cuisine);
      const newCuisines = isSelected
        ? filters.cuisines.filter((c) => c !== cuisine)
        : [...filters.cuisines, cuisine];

      updateQueryParam("cuisine", newCuisines.join(","), router);
      setCuisinesFilter(newCuisines);
    },
    [filters.cuisines, router]
  );

  const handleFilterByMinRating = (minRating: number | null) => {
    updateQueryParam("min_rating", minRating, router);
    setMinRatingFilter(minRating);
  };

  const handleResetFilters = () => {
    setNameFilter("");
    setCuisinesFilter([]);
    setMinRatingFilter(null);
    setIsPetFriendlyFilter(null);
    setLocalSearch("");
    setCurrentPage(1);

    const newParams = new URLSearchParams();
    router.push(`/user/restaurants?${newParams.toString()}`);
  };

  return (
    <div className="position-relative">
      <div className="d-flex align-items-center justify-content-between gap-2">
        <input
          type="text"
          placeholder="Search by name"
          value={localSearch}
          onChange={handleSearchChange}
          className="form-control fw-semibold me-3"
          style={{ maxWidth: "300px" }}
        />
        <button
          ref={buttonRef}
          className={`btn btn-outline-secondary bg-light text-black fw-semibold ${styles.responsiveBtn}`}
          onClick={() => {
            setShowCuisines(false);
            setShowFilters(!showFilters);
          }}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div
          ref={filterRef}
          className={`bg-white p-3 rounded shadow-sm ms-auto border ${
            styles.filtersContainer
          } ${showFilters ? styles.filtersShow : styles.filtersHide}`}
          style={{
            maxWidth: "300px",
            zIndex: 10,
          }}
        >
          <div className="mb-3">
            <select
              className="form-select mb-2"
              value={filters.minRating ?? ""}
              onChange={(e) =>
                handleFilterByMinRating(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
            >
              <option value="">Rating</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} Star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              checked={filters.isPetFriendly || false}
              onChange={handleFilterByPetFriendly}
            />
            <label className="form-check-label">Pet Friendly</label>
          </div>

          <div className="mb-3">
            <button
              className="btn btn-outline-secondary rounded-pill"
              onClick={() => setShowCuisines(!showCuisines)}
            >
              {showCuisines ? "Hide Cuisines" : "Show Cuisines"}
            </button>

            {showCuisines && (
              <div className="mt-3">
                <div className="d-flex flex-wrap gap-2">
                  {Object.values(Cuisine).map((cuisine) => (
                    <div key={cuisine} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={filters.cuisines.includes(cuisine)}
                        onChange={() => handleCuisineToggle(cuisine)}
                      />
                      <label className="form-check-label">{cuisine}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            className="btn btn-danger w-100 rounded-pill"
            onClick={handleResetFilters}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default observer(Filters);
