import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import BookingModel from "@/stores/models/BookingModel";
import { Instance } from "mobx-state-tree";

interface BookingItemProps {
  booking: Instance<typeof BookingModel>;
  onCancel: Dispatch<SetStateAction<number | null>>;
}

const BookingItem: React.FC<BookingItemProps> = ({ booking, onCancel }) => {
  const isCancelled = booking.status === "cancelled";

  return (
    <div className="list-group-item p-3 border shadow-sm rounded mb-2 bg-white bg-opacity-75">
      <div className="row g-3">
        <div className="col-md-2 col-4 d-flex flex-column">
          <strong>Restaurant:</strong>
          <Link
            href={`/user/restaurants/${booking.table.restaurant.id}`}
            className="text-decoration-none"
          >
            {booking.table.restaurant.name}
          </Link>
        </div>

        <div className="col-md-2 col-4 d-flex flex-column">
          <strong>Date:</strong>
          {new Date(booking.start_time)
            .toLocaleDateString()
            .split("/")
            .join(".")}
        </div>

        <div className="col-md-2 col-4 d-flex flex-column">
          <strong>Time:</strong>
          {new Date(booking.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        <div className="col-md-2 col-4 d-flex flex-column">
          <strong>Guests:</strong>
          {booking.num_people}
        </div>

        <div className="col-md-2 col-4 d-flex flex-column">
          <strong>Status:</strong>
          <span
            className={`badge align-self-start ${
              isCancelled
                ? "border border-dark text-dark"
                : booking.status === "confirmed"
                ? "border border-success text-success"
                : "bg-danger"
            }`}
          >
            {booking.status}
          </span>
        </div>

        <div className="col-md-2 col-4 d-flex flex-column">
          {isCancelled ? (
            <div style={{ width: "80px" }} />
          ) : (
            <button
              className="btn btn-sm btn-outline-danger flex-grow-1 align-self-md-end align-self-sm-start"
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
