"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/context";
import BookingModal from "@/components/BookingModal";
import { toast } from "react-toastify";
import { Instance } from "mobx-state-tree";
import RestaurantModel from "@/stores/models/RestaurantModel";
import ImageUploader from "@/components/ImageUploader";

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { restaurantStore, userStore } = useStore();
  const [restaurant, setRestaurant] = useState<Instance<
    typeof RestaurantModel
  > | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const load = async (isOwner = false) => {
    try {
      const data = await restaurantStore.fetchRestaurantById(
        String(id),
        isOwner
      );
      setRestaurant(data);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (userStore.user?.role === "client") load();
    else if (userStore.user?.role === "owner") load(true);
  }, [id]);

  const handleMenuUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await restaurantStore.uploadFile(
        file,
        setProgress,
        restaurant?.id
      );
      toast.success("Upload successful");
      setRestaurant({
        ...restaurant,
        menu_url: data.menu_url,
      });
      console.log(data.menu_url);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  if (restaurantStore.loading)
    return (
      <div className="container py-5">
        <p className="text-center fs-3">Loading...</p>
      </div>
    );

  if (!restaurant || restaurantStore.error)
    return (
      <div className="container py-5">
        <p className="text-center fs-1">Restaurant not found</p>
      </div>
    );

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
          {userStore.isOwner ? (
            <ImageUploader
              size={200}
              id={restaurant.id}
              onUpload={restaurantStore.uploadFile}
              iconClassName="fa-image"
              imageUrl={restaurant?.logo_url as string}
              onUploadedUrl={(url) =>
                setRestaurant((prev) => prev && { ...prev, logo_url: url })
              }
            ></ImageUploader>
          ) : (
            <img
              src={restaurant.logo_url || "/default-restaurant.png"}
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
            <div className="m-0 d-flex gap-4">
              <a
                href={`tel:${restaurant.phone}`}
                className="text-secondary text-decoration-none"
              >
                📞 {restaurant.phone}
              </a>
              <a
                href={restaurant.inst_url}
                className="text-secondary text-decoration-none instagram-link d-flex align-items-center"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i
                  className="fab fa-instagram"
                  style={{
                    fontSize: "20px",
                  }}
                ></i>
              </a>
            </div>
            <div className="d-flex gap-2 gap-md-3">
              <button
                className="btn btn-sm btn-outline-primary fw-bold p-1"
                onClick={() => setShowModal(true)}
              >
                🍽️ Book Table
              </button>
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
              {userStore.isOwner && (
                <>
                  <input
                    id="menu-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleMenuUpload}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="menu-upload"
                    title="Edit menu"
                    style={{ cursor: "pointer" }}
                    className="align-self-center border border-dark px-1 btn btn-sm btn-light"
                  >
                    <i
                      className="far fa-clipboard text-secondary"
                      style={{ fontSize: "16px" }}
                    ></i>
                  </label>
                </>
              )}
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
                    <small className="text-center">
                      {String(hours).split("-")}
                    </small>
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
