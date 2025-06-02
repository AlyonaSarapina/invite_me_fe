import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import BookingModel from "@/stores/models/BookingModel";
import { Instance } from "mobx-state-tree";
import styles from "./BookingItem.module.css";
import { BookingStatus } from "@/types/enums";

interface BookingItemProps {
  userRole?: string;
  booking: Instance<typeof BookingModel>;
  onCancel: Dispatch<SetStateAction<number | null>>;
}

const BookingItem: React.FC<BookingItemProps> = ({
  userRole,
  booking,
  onCancel,
}) => {
  const isCancelled = booking.status === BookingStatus.CANCELLED;
  const isCompleted = booking.status === BookingStatus.COMPLETED;

  return (
    <div className="list-group-item p-3 border shadow-sm rounded mb-2 bg-white bg-opacity-75">
      <div className="row g-3">
        <div className="col-md-2 col-4 d-flex flex-column">
          <strong>Restaurant:</strong>
          <Link
            href={`/user/restaurants/${booking.table.restaurant?.id}`}
            className="text-decoration-none"
          >
            {booking.table.restaurant?.name}
          </Link>
        </div>

        <div className="col-md-2 col-4 d-flex flex-column">
          <strong>Date:</strong>
          {new Date(booking.start_time)
            .toLocaleDateString()
            .split("/")
            .join(".")}
        </div>

        {userRole === "owner" && (
          <div className="col-md-2 col-4 d-flex flex-column">
            <strong>Table №:</strong>
            {booking.table.table_number}
          </div>
        )}

        <div className="col-md-2 col-4 d-flex flex-column">
          <strong>Guests:</strong>
          {booking.num_people}
        </div>

        <div className="col-md-2 col-4 d-flex flex-column">
          <strong>Time:</strong>
          {new Date(booking.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        <div className="col-md-2 col-4 d-flex flex-column">
          <strong>Status:</strong>
          <span
            className={`badge align-self-start ${
              isCancelled
                ? "border border-dark text-dark"
                : booking.status === "confirmed"
                ? "border border-success text-success"
                : booking.status === "completed"
                ? "border border-primary text-primary"
                : "bg-danger"
            }`}
          >
            {booking.status}
          </span>
        </div>

        {userRole === "owner" && (
          <>
            <div className="col-md-2 col-4 d-flex flex-column">
              <strong>Client:</strong>
              {booking.client.name}
            </div>
            <div className="col-md-2 col-4 d-flex flex-column">
              <strong>Client Phone:</strong>
              <a
                href={`tel:${booking.client.phone}`}
                className="text-decoration-none"
              >
                +{booking.client.phone}
              </a>
            </div>
          </>
        )}
        <div className="col-md-2 col-4 d-flex flex-column ms-auto">
          {isCancelled || isCompleted ? (
            <div className={styles.button_placeholder} />
          ) : (
            <button
              className="btn btn-sm btn-outline-danger align-self-start"
              onClick={() => onCancel(booking.id)}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingItem;
