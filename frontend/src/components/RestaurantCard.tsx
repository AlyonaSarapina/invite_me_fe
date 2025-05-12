import Link from "next/link";
import { RestaurantCardData } from "@/types/RestaurantCardData";

type Props = {
  restaurant: RestaurantCardData;
};

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <div
      className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden p-3"
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
        <div className="d-flex justify-content-between align-items mb-2">
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
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div className="w-100">
            <div
              className="text-dark mb-2 small"
              style={{ fontSize: "0.875rem" }}
            >
              🍽️ {restaurant.cuisine}
            </div>
            {restaurant.is_pet_friendly && (
              <div className="text-dark small mb-2">🐾 Pet Friendly</div>
            )}
            <div className="text-dark small">
              📍 {restaurant.address.split(",")[1] || "City"}
            </div>
          </div>
          <div className="align-self-end">
            <Link
              href={`/user/restaurants/${restaurant.id}`}
              className="btn btn-sm btn-outline-success px-3 rounded fw-bold"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
