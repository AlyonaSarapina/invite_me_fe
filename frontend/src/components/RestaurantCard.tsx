"use client";

import Link from "next/link";
import { RestaurantCardData } from "@/types/RestaurantCardData";

type Props = {
  restaurant: RestaurantCardData;
};

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <div
      className="card h-100 shadow-sm border-0 overflow-hidden p-3"
      style={{ maxWidth: "300px", margin: "0 auto" }}
    >
      <div className="position-relative mb-3">
        {restaurant.logo_url && (
          <img
            src={restaurant.logo_url}
            className="card-img-top rounded-3"
            alt={restaurant.name}
            style={{
              height: "180px",
              objectFit: "cover",
              maxHeight: "180px",
            }}
          />
        )}
      </div>

      <div className="d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between mb-2">
          <h5
            className="card-title fw-bold text-dark mb-0"
            style={{ fontSize: "1rem" }}
          >
            {restaurant.name}
          </h5>
          <span className="d-flex align-items-center text-success fw-bold">
            ⭐️ {+restaurant.rating}
          </span>
        </div>
        <div className="d-flex justify-content-between flex-column gap-2">
          <div className="text-dark small" style={{ fontSize: "0.875rem" }}>
            🍽️ {restaurant.cuisine}
          </div>
          <div className="text-dark small">
            📍
            {restaurant.address.split(" ").reverse()[0]}
          </div>
          <Link
            href={`/user/restaurants/${restaurant.id}`}
            className="btn btn-sm btn-outline-secondary rounded fw-bold w-100"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
