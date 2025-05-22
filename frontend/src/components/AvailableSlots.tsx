"use client";

import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";

interface AvailableSlotsProps {
  slots: string[];
  selectedSlot: string;
  setSelectedSlot: Dispatch<SetStateAction<string>>;
}

export const AvailableSlots: React.FC<AvailableSlotsProps> = ({
  slots,
  selectedSlot,
  setSelectedSlot,
}) => (
  <>
    <h6>Available Slots:</h6>
    <div className="d-flex flex-wrap gap-2">
      {slots.map((slot, index) => (
        <button
          key={index}
          className={`btn ${
            selectedSlot === slot ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setSelectedSlot(slot)}
        >
          {format(new Date(slot), "HH:mm")}
        </button>
      ))}
    </div>
  </>
);
