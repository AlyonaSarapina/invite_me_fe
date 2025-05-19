"use client";

import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";

import { Instance, ModelInstanceTypeProps } from "mobx-state-tree";
import RestaurantModel from "@/stores/models/RestaurantModel";
import { useStore } from "@/stores/context";
import { observer } from "mobx-react";

interface RestaurantCardProps {
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
  setRestaurantToEdit: Dispatch<
    SetStateAction<Instance<typeof RestaurantModel> | undefined>
  >;
  restaurant: Instance<typeof RestaurantModel>;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  setShowModal,
  setRestaurantToEdit,
  restaurant,
}) => {
  const { userStore } = useStore();
  return (
    <div
      className="card h-100 shadow-sm border-0 overflow-hidden p-3"
      style={{ maxWidth: "250px", margin: "0 auto", opacity: 0.9 }}
    >
      <div className="position-relative mb-3 border rounded-3">
        <img
          src={restaurant.logo_url || "/default-restaurant.png"}
          className="card-img-top rounded-3"
          alt={restaurant.name}
          style={{
            height: "180px",
            objectFit: "cover",
            maxHeight: "180px",
          }}
        />
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
        <div className="d-flex flex-column justify-content-between gap-2">
          {userStore.isOwner && (
            <div className="d-flex justify-content-between text-dark small fw-bold">
              <span className="align-self-center">
                {restaurant.tables_capacity} tables
              </span>
              <button className="btn btn-sm btn-outline-secondary rounded fw-bold">
                Add table
              </button>
            </div>
          )}
          <div className="text-dark small" style={{ fontSize: "0.875rem" }}>
            🍽️ {restaurant.cuisine}
          </div>
          <div className="text-dark small">
            📍
            {restaurant.address.split(", ").reverse()[0]}
          </div>
          <div className={`${userStore.isOwner && "d-flex"} gap-2`}>
            <Link
              href={`/user/restaurants/${restaurant.id}`}
              className="btn btn-outline-secondary rounded fw-bold w-100"
            >
              View Details
            </Link>
            {userStore.isOwner && (
              <button
                className="btn btn-sm btn-outline-secondary rounded fw-bold"
                onClick={() => {
                  setRestaurantToEdit(restaurant);
                  setShowModal(true);
                }}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(RestaurantCard);
