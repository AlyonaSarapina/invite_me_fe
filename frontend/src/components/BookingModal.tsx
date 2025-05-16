"use client";

import { useStore } from "@/stores/context";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RestaurantDetails } from "@/types/RestaurantDetails";
import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";
import { useBookingForm } from "@/hooks/useBookingForm";
import { generateTimeSlots } from "@/utils/timeSlots";
import { AvailableSlots } from "./AvailableSlots";

interface BookingModalProps {
  restaurant: RestaurantDetails;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const BookingModal: React.FC<BookingModalProps> = ({
  restaurant,
  setShowModal,
}) => {
  const { bookingStore } = useStore();
  const {
    selectedDate,
    numPeople,
    selectedStartTime,
    selectedTimeSlot,
    setSelectedDate,
    setNumPeople,
    setSelectedStartTime,
    setSelectedTimeSlot,
    errors,
    validateForm,
    resetForm,
    minDate,
    maxDate,
  } = useBookingForm();
  const [availableSlotsError, setAvailableSlotsError] = useState<string>("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [creatingBooking, setCreatingBooking] = useState(false);

  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dateInputRef.current?.focus();
  }, []);

  const getTodayHours = (): {
    openingTime: string;
    closingTime: string;
  } | null => {
    if (!restaurant?.operating_hours) return null;

    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const today = weekDays[new Date(selectedDate || new Date()).getDay()];

    const todayHours = restaurant.operating_hours[today];

    if (!todayHours) return null;

    const [openingTime, closingTime] = todayHours
      .split("-")
      .map((t) => t.trim());

    return { openingTime, closingTime };
  };

  const timeSlots = useMemo(() => {
    const hours = getTodayHours();

    if (!hours) return [];

    return generateTimeSlots(hours.openingTime, hours.closingTime);
  }, [restaurant?.operating_hours, selectedDate]);

  const handleFetchAvailableSlots = async () => {
    setAvailableSlotsError("");
    if (!validateForm()) return;

    setLoadingSlots(true);
    try {
      await bookingStore.fetchAvailableSlots(
        restaurant.id,
        selectedDate,
        numPeople,
        selectedStartTime
      );

      if (bookingStore.availableSlots.length === 0) {
        setAvailableSlotsError("No available slots for chosen time.");
      }
    } catch (error) {
      toast.error("⚠️ Failed to fetch available slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookingCreate = async () => {
    setCreatingBooking(true);
    try {
      const res = await bookingStore.createBooking(restaurant.id, {
        start_time: selectedTimeSlot,
        num_people: numPeople,
      });

      if (res.status === "confirmed") {
        toast.success("🎉 Booking confirmed!");
        bookingStore.clearSlots();
        setShowModal(false);
      } else {
        toast.error("❌ Booking failed. Please try again");
      }
    } catch (err) {
      toast.error("❌ Something went wrong.");
    } finally {
      setCreatingBooking(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content p-3">
            <div className="modal-header">
              <h5 className="modal-title">Book a Table</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => {
                  bookingStore.clearSlots();
                  resetForm();
                  setShowModal(false);
                }}
              ></button>
            </div>

            <div className="modal-body">
              <div className="form-group mb-3">
                <label htmlFor="date">Select Date</label>
                <input
                  type="date"
                  ref={dateInputRef}
                  id="date"
                  className={`form-control ${errors.date ? "is-invalid" : ""}`}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={minDate}
                  max={maxDate}
                />
                {errors.date && (
                  <div className="invalid-feedback">{errors.date}</div>
                )}
              </div>

              <div className="form-group mb-3">
                <label htmlFor="startTime">Desired Start Time</label>
                <select
                  id="startTime"
                  className={`form-select ${errors.time ? "is-invalid" : ""}`}
                  value={selectedStartTime}
                  onChange={(e) => setSelectedStartTime(e.target.value)}
                  disabled={timeSlots.length === 0}
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <div className="invalid-feedback">{errors.time}</div>
                )}
              </div>

              <div className="form-group mb-3">
                <label htmlFor="numPeople">Number of People</label>
                <input
                  type="number"
                  id="numPeople"
                  className={`form-control ${
                    errors.people ? "is-invalid" : ""
                  }`}
                  value={numPeople}
                  onChange={(e) => setNumPeople(Number(e.target.value))}
                  min="1"
                />
                {errors.people && (
                  <div className="invalid-feedback">{errors.people}</div>
                )}
              </div>

              <button
                className="btn btn-primary w-100 mb-3"
                onClick={handleFetchAvailableSlots}
                disabled={loadingSlots}
              >
                {loadingSlots ? "Checking..." : "Check Available Slots"}
              </button>

              {availableSlotsError && (
                <div className="text-danger mb-2">{availableSlotsError}</div>
              )}

              {bookingStore.availableSlots.length > 0 && (
                <AvailableSlots
                  slots={bookingStore.availableSlots}
                  selectedSlot={selectedTimeSlot}
                  setSelectedSlot={setSelectedTimeSlot}
                />
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-success"
                onClick={handleBookingCreate}
                disabled={!selectedTimeSlot || creatingBooking}
              >
                {creatingBooking ? "Booking..." : "Confirm Booking"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  bookingStore.clearSlots();
                  resetForm();
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default observer(BookingModal);
