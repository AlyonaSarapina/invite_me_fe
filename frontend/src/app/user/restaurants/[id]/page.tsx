"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { restaurantStore } from "@/stores/RestaurantStore";
import Link from "next/link";
import { RestaurantDetails } from "@/types/RestaurantDetails";

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await restaurantStore.fetchRestaurantById(String(id));
      setRestaurant(data);
    };
    load();
  }, [id]);

  if (restaurantStore.loading) return <p>Loading...</p>;
  if (!restaurant) return <p>Restaurant not found.</p>;

  return (
    <div className="container py-5">
      <button onClick={handleBack} className="mb-4 btn btn-outline-primary">
        <i className="fas fa-arrow-left"></i> Back
      </button>
      <div className="d-flex flex-md-row gap-4  justify-content-center gap-md-5">
        {restaurant.logo_url && (
          <img
            src={restaurant.logo_url}
            alt={restaurant.name}
            className="img-fluid rounded-3 shadow-sm"
            style={{ maxWidth: "220px" }}
          />
        )}
        <div>
          <h1 className="fw-bold" style={{ color: "#4A8BDF" }}>
            {restaurant.name}
          </h1>
          <p className="lead text-muted">{restaurant.cuisine} cuisine</p>
          <p className="fw-bold">⭐ {+restaurant.rating} / 5</p>
          {restaurant.is_pet_friendly && (
            <p className="badge bg-success">🐾 Pet Friendly</p>
          )}
          <p className="text-secondary">📍 {restaurant.address}</p>
          <p>
            <a
              href={`tel:${restaurant.phone}`}
              className="text-secondary text-decoration-none"
            >
              📞 {restaurant.phone}
            </a>
          </p>
          <div className="d-flex gap-3">
            {restaurant.menu_url && (
              <a
                href={restaurant.menu_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-primary fw-bold"
              >
                📋 View Menu
              </a>
            )}
            <Link
              href={`/user/book/${restaurant.id}`}
              className="btn btn-sm btn-outline-primary fw-bold"
            >
              🍽️ Book Table Now
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <h4 className="fw-semibold">About</h4>
        <p>{restaurant.description}</p>
      </div>
      {restaurant.operating_hours && (
        <div className="col-12 col-lg-6 m-auto">
          <h4 className="fw-semibold text-center">Opening Hours</h4>
          <ul className="list-unstyled d-flex justify-content-around gap-1">
            {Object.entries(restaurant.operating_hours).map(([day, hours]) => (
              <li
                key={day}
                className="text-sm d-flex flex-column border border-primary p-1 rounded gap"
              >
                <strong className="text-center">{day.slice(0, 3)}</strong>
                <small className="text-center">{hours}</small>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="row">
        <div className="col-12 col-lg-6 offset-lg-3">
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
    </div>
  );
};

export default observer(RestaurantDetailsPage);
