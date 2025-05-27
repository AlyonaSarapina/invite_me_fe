"use client";

import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/context";
import { toast } from "react-toastify";
import BookingFilters from "@/components/BookingFilters";
import BookingItem from "@/components/BookingItem";
import CancelModal from "@/components/CancelModal";
import PaginationControls from "@/components/Pagination";

const BookingsPage = () => {
  const { bookingStore, userStore } = useStore();
  const {
    bookings,
    fetchBookings,
    cancelBooking,
    allStatuses,
    allRestaurants,
    sortOrder,
    setSortOrder,
    statusFilter,
    setStatusFilter,
    restaurantFilter,
    setRestaurantFilter,
    totalCount,
    currentPage,
    bookingsPerPage,
  } = bookingStore;

  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );

  const handlePageChange = (page: number) => {
    bookingStore.setCurrentPage(page);
    fetchBookings();
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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

      {bookings.length === 0 ? (
        <p className="text-muted">No bookings match your filters.</p>
      ) : (
        <div className="d-flex flex-column gap-2">
          {bookings.map((booking) => (
            <BookingItem
              key={booking.id}
              userRole={userStore.user?.role}
              booking={booking}
              onCancel={setSelectedBookingId}
            />
          ))}
        </div>
      )}

      <PaginationControls
        totalItems={totalCount}
        itemsPerPage={bookingsPerPage}
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
