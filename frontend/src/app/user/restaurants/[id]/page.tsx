"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { RestaurantDetails } from "@/types/RestaurantDetails";
import { useStore } from "@/stores/context";
import BookingModal from "@/components/BookingModal";

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { restaurantStore } = useStore();
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleBack = () => {
    router.back();
  };

  const load = async () => {
    const data = await restaurantStore.fetchRestaurantById(String(id));
    setRestaurant(data);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (restaurantStore.loading) return <p>Loading...</p>;
  if (!restaurant) return <p>Restaurant not found.</p>;

  return (
    <div className="container d-flex flex-column py-5">
      <button
        onClick={handleBack}
        className="mb-4 btn btn-primary align-self-start"
      >
        <i className="fas fa-arrow-left"></i> Back
      </button>
      <div
        className="card p-4 align-self-center rounded-4"
        style={{
          maxWidth: "700px",
        }}
      >
        <div className="d-flex flex-md-row gap-2 gap-md-4">
          {restaurant.logo_url && (
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="img-fluid rounded-3 shadow"
              style={{
                maxWidth: "200px",
                objectFit: "contain",
              }}
            />
          )}
          <div className="d-flex flex-column gap-2 justify-content-between">
            <h1 className="fw-bold m-0">{restaurant.name}</h1>
            <p className="lead text-muted m-0">{restaurant.cuisine} cuisine</p>
            <p className="fw-bold m-0">⭐ {+restaurant.rating} / 5</p>
            {restaurant.is_pet_friendly && (
              <p className="badge bg-success m-0 align-self-start">
                🐾 Pet Friendly
              </p>
            )}
            <p className="text-secondary m-0">📍 {restaurant.address}</p>
            <p className="m-0">
              <a
                href={`tel:${restaurant.phone}`}
                className="text-secondary text-decoration-none"
              >
                📞 {restaurant.phone}
              </a>
              <a
                href={restaurant.inst_url}
                className="text-secondary text-decoration-none ms-3 instagram-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </p>
            <div className="d-flex gap-3">
              {restaurant.menu_url && (
                <a
                  href={restaurant.menu_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary fw-bold p-1"
                >
                  📋 Menu
                </a>
              )}
              <button
                className="btn btn-sm btn-outline-primary fw-bold p-1"
                onClick={() => setShowModal(true)}
              >
                🍽️ Book Table
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <h4 className="fw-semibold">About</h4>
          <p>{restaurant.description}</p>
        </div>
        {restaurant.operating_hours && (
          <div>
            <h4 className="fw-semibold">Opening Hours</h4>
            <ul className="list-unstyled d-flex justify-content-around gap-1">
              {Object.entries(restaurant.operating_hours).map(
                ([day, hours]) => (
                  <li
                    key={day}
                    className="text-sm d-flex flex-column border border-primary p-1 rounded gap"
                  >
                    <strong className="text-center text-capitalize">
                      {day.slice(0, 3)}
                    </strong>
                    <small className="text-center">{hours.split("-")}</small>
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        <div>
          <h4 className="fw-semibold">Location</h4>
          <div className="ratio ratio-4x3 rounded-3 shadow-sm border">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                restaurant.address
              )}&output=embed`}
              loading="lazy"
              style={{ border: 0 }}
              allowFullScreen
            />
          </div>
        </div>
      </div>
      {showModal && (
        <BookingModal restaurant={restaurant} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default observer(RestaurantDetailsPage);
