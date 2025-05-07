import Link from "next/link";
import { RestaurantCardData } from "@/types/RestaurantCardData";
import styles from "@/styles/RestaurantCard.module.css";

type Props = {
  restaurant: RestaurantCardData;
};

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="text-decoration-none text-dark"
    >
      <div
        className={`card h-100 border-0 shadow-sm rounded-4 overflow-hidden ${styles.card}`}
      >
        <div className="position-relative">
          {restaurant.logo_url && (
            <img
              src={restaurant.logo_url}
              className="card-img-top"
              alt={restaurant.name}
              style={{ height: "220px", objectFit: "cover" }}
            />
          )}
          <span
            className="position-absolute top-0 end-0 bg-dark text-white px-2 py-1 rounded-bottom-start"
            style={{ fontSize: "0.9rem" }}
          >
            ⭐ {+restaurant.rating}/5
          </span>
        </div>

        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 className="card-title">{restaurant.name}</h5>
            <p className="text-muted mb-1">
              <strong>Cuisine:</strong> {restaurant.cuisine}
            </p>
            {restaurant.is_pet_friendly && (
              <span className="badge bg-success mb-2">🐾 Pet Friendly</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
