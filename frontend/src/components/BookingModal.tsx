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
import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";
import { useBookingForm } from "@/hooks/useBookingForm";
import { generateTimeSlots } from "@/utils/timeSlots";
import { AvailableSlots } from "./AvailableSlots";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { Instance } from "mobx-state-tree";
import RestaurantModel from "@/stores/models/RestaurantModel";

interface BookingModalProps {
  restaurant: Instance<typeof RestaurantModel>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const BookingModal: React.FC<BookingModalProps> = ({
  restaurant,
  setShowModal,
}) => {
  const { bookingStore, userStore } = useStore();
  const {
    selectedDate,
    numPeople,
    selectedStartTime,
    selectedTimeSlot,
    setSelectedDate,
    setNumPeople,
    setSelectedStartTime,
    setSelectedTimeSlot,
    clientPhoneNumber,
    setClientPhoneNumber,
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

  const getTodayHours = () => {
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
      .map((t: string) => t.trim());
    return { openingTime, closingTime };
  };

  const timeSlots = useMemo(() => {
    const hours = getTodayHours();
    if (!hours) return [];
    return generateTimeSlots(hours.openingTime, hours.closingTime);
  }, [restaurant?.operating_hours, selectedDate]);

  function getPeriodFromTime(
    time: string
  ): "morning" | "lunch" | "dinner" | null {
    const [hour] = time.split(":").map(Number);
    if (hour >= 8 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "lunch";
    if (hour >= 17 && hour < 22) return "dinner";
    return null;
  }

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
      const selectedPeriod = getPeriodFromTime(selectedStartTime);
      const existingBooking = bookingStore.bookings.find((b) => {
        if (b.status === "cancelled") return false;
        const bookingDate = b.start_time.split("T")[0];
        const bookingTime = b.start_time.split("T")[1]?.slice(0, 5);
        return (
          bookingDate === selectedDate &&
          getPeriodFromTime(bookingTime) === selectedPeriod
        );
      });

      if (existingBooking) {
        toast.warn(
          `⚠️ You already have a ${selectedPeriod} booking on ${
            existingBooking.start_time.split("T")[0]
          }`
        );
        return;
      }

      const res = await bookingStore.createBooking(restaurant.id, {
        start_time: selectedTimeSlot,
        num_people: numPeople,
        clientPhoneNumber:
          userStore.user?.role === "owner" ? clientPhoneNumber : undefined,
      });

      if (res.status === "confirmed") {
        toast.success("🎉 Booking confirmed!");
        bookingStore.clearSlots();
        bookingStore.fetchBookings();
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

  const handleClose = () => {
    bookingStore.clearSlots();
    resetForm();
    setShowModal(false);
  };

  return (
    <Modal show onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book a Table</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3" controlId="date">
          <Form.Label>Select Date</Form.Label>
          <Form.Control
            type="date"
            ref={dateInputRef}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            isInvalid={!!errors.date}
            min={minDate}
            max={maxDate}
          />
          <Form.Control.Feedback type="invalid">
            {errors.date}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="startTime">
          <Form.Label>Desired Start Time</Form.Label>
          <Form.Select
            value={selectedStartTime}
            onChange={(e) => setSelectedStartTime(e.target.value)}
            isInvalid={!!errors.time}
            disabled={timeSlots.length === 0}
          >
            <option value="">Select a time</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.time}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="numPeople">
          <Form.Label>Number of People</Form.Label>
          <Form.Control
            type="number"
            value={numPeople}
            onChange={(e) => setNumPeople(Number(e.target.value))}
            min={1}
            isInvalid={!!errors.people}
          />
          <Form.Control.Feedback type="invalid">
            {errors.people}
          </Form.Control.Feedback>
        </Form.Group>

        {userStore.user?.role === "owner" && (
          <Form.Group className="mb-3" controlId="clientPhoneNumber">
            <Form.Label>Client Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="e.g., 441234567890"
              value={clientPhoneNumber}
              onChange={(e) => setClientPhoneNumber(e.target.value)}
              required
            />
          </Form.Group>
        )}

        <Button
          variant="primary"
          className="w-100 mb-3"
          onClick={handleFetchAvailableSlots}
          disabled={loadingSlots}
        >
          {loadingSlots ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Check Available Slots"
          )}
        </Button>

        {availableSlotsError && (
          <Alert variant="danger">{availableSlotsError}</Alert>
        )}

        {bookingStore.availableSlots.length > 0 && (
          <AvailableSlots
            slots={bookingStore.availableSlots}
            selectedSlot={selectedTimeSlot}
            setSelectedSlot={setSelectedTimeSlot}
          />
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="success"
          onClick={handleBookingCreate}
          disabled={!selectedTimeSlot || !clientPhoneNumber || creatingBooking}
        >
          {creatingBooking ? "Booking..." : "Confirm Booking"}
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default observer(BookingModal);
