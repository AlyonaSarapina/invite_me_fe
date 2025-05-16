"use client";

import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/context";
import { toast } from "react-toastify";
import BookingFilters from "@/components/BookingFilters";
import BookingItem from "@/components/BookingItem";
import CancelModal from "@/components/CancelModal";
import { Pagination } from "react-bootstrap";
import PaginationControls from "@/components/Pagination";

const BOOKINGS_PER_PAGE = 5;

const BookingsPage = () => {
  const { bookingStore, userStore } = useStore();
  const { bookings, fetchBookings, cancelBooking } = bookingStore;

  const [sortOrder, setSortOrder] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [restaurantFilter, setRestaurantFilter] = useState("all");
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (userStore.user) fetchBookings();
  }, [userStore.user]);

  const filtered = bookings.filter(
    (b) =>
      (statusFilter === "all" || b.status === statusFilter) &&
      (restaurantFilter === "all" ||
        b.table.restaurant.name === restaurantFilter)
  );

  const allRestaurants = [
    ...new Set(bookings.map((b) => b.table.restaurant.name)),
  ];

  const allStatuses = [...new Set(bookings.map((b) => b.status))];

  const sortedAndFiltered = [...filtered].sort((a, b) => {
    const diff =
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    return sortOrder === "newest" ? -diff : diff;
  });

  const startIdx = (currentPage - 1) * BOOKINGS_PER_PAGE;

  const paginatedBookings = sortedAndFiltered.slice(
    startIdx,
    startIdx + BOOKINGS_PER_PAGE
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleCancelConfirm = async () => {
    if (!selectedBookingId) return;
    const res = await cancelBooking(selectedBookingId);
    if (res?.status === "cancelled") {
      toast.success("Booking is cancelled");
      fetchBookings();
    } else {
      toast.error("Failed to cancel booking");
    }
    setSelectedBookingId(null);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, restaurantFilter, sortOrder]);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-light text-outline-dark">My Bookings</h2>

      <BookingFilters
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        restaurantFilter={restaurantFilter}
        setRestaurantFilter={setRestaurantFilter}
        statuses={allStatuses}
        restaurants={allRestaurants}
      />

      {paginatedBookings.length === 0 ? (
        <p className="text-muted">No bookings match your filters.</p>
      ) : (
        <div className="d-flex flex-column gap-2">
          {paginatedBookings.map((booking) => (
            <BookingItem
              key={booking.id}
              booking={booking}
              onCancel={setSelectedBookingId}
            />
          ))}
        </div>
      )}

      <PaginationControls
        totalItems={sortedAndFiltered.length}
        itemsPerPage={BOOKINGS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <CancelModal
        show={selectedBookingId !== null}
        onClose={() => setSelectedBookingId(null)}
        onConfirm={handleCancelConfirm}
      />
    </div>
  );
};

export default observer(BookingsPage);
