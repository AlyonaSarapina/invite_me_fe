import { useState } from "react";
import { format, addMonths } from "date-fns";

export function useBookingForm(initialPeople = 2) {
  const [selectedDate, setSelectedDate] = useState("");
  const [numPeople, setNumPeople] = useState(initialPeople);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [clientPhoneNumber, setClientPhoneNumber] = useState("");
  const [errors, setErrors] = useState({ date: "", time: "", people: "" });

  const validateForm = () => {
    const newErrors = { date: "", time: "", people: "" };

    if (!selectedDate) newErrors.date = "Date is required.";
    if (!selectedStartTime) newErrors.time = "Start time is required.";
    if (!numPeople || numPeople <= 0)
      newErrors.people = "Please enter number of people.";

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const resetForm = () => {
    setSelectedDate("");
    setNumPeople(initialPeople);
    setSelectedStartTime("");
    setSelectedTimeSlot("");
    setErrors({ date: "", time: "", people: "" });
  };

  return {
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
    maxDate: format(addMonths(new Date(), 2), "yyyy-MM-dd"),
    minDate: format(new Date(), "yyyy-MM-dd"),
  };
}
