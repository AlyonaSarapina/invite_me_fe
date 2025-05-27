"use client";

import Link from "next/link";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Instance } from "mobx-state-tree";
import RestaurantModel from "@/stores/models/RestaurantModel";
import { useStore } from "@/stores/context";
import { observer } from "mobx-react";
import styles from "./RestaurantCard.module.css";
import TableModal from "../TableModal/TableModal";

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
  const { userStore, tableStore } = useStore();
  const [tablesLength, setTablesLength] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const getTablesLength = async () => {
    const tables: [] = await tableStore.getTableByRestaurant(restaurant.id);
    setTablesLength(tables.length);
  };

  useEffect(() => {
    getTablesLength();
  }, []);

  return (
    <div
      className={`card h-100 shadow-sm border-0 overflow-hidden p-3 ${styles.cardWrapper}`}
    >
      <div className={styles.imageWrapper}>
        <img
          src={restaurant.logo_url || "/default-restaurant.png"}
          className={`card-img-top ${styles.logo}`}
          alt={restaurant.name}
        />
      </div>

      <div className="d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between mb-2">
          <h5 className={`card-title fw-bold text-dark mb-0 ${styles.title}`}>
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
                {tablesLength} {tablesLength === 1 ? "table" : "tables"}
              </span>
              <button
                onClick={() => setModalOpen(true)}
                className="btn btn-sm btn-outline-secondary rounded fw-bold"
              >
                Add table
              </button>
              <TableModal
                show={modalOpen}
                onHide={() => setModalOpen(false)}
                restaurantId={restaurant.id}
                onTableAdded={getTablesLength}
              />
            </div>
          )}
          <div className={`text-dark small ${styles.detailsText}`}>
            🍽️ {restaurant.cuisine}
          </div>
          <div className="text-dark small">
            📍{restaurant.address.split(", ").reverse()[0]}
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
