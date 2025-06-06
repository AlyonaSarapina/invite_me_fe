import { BookingStatus, SortDate } from "@/types/enums";

interface BookingFiltersProps {
  sortOrder: string;
  setSortOrder: (order: SortDate) => void;
  statusFilter: string;
  setStatusFilter: (status: BookingStatus | "all") => void;
  restaurantFilter: string;
  setRestaurantFilter: (value: string) => void;
  statuses: Array<string>;
  restaurants: Array<string>;
}

const BookingFilters: React.FC<BookingFiltersProps> = ({
  sortOrder,
  setSortOrder,
  statusFilter,
  setStatusFilter,
  restaurantFilter,
  setRestaurantFilter,
  statuses,
  restaurants,
}) => (
  <div className="d-flex flex-wrap gap-3 mb-4 align-items-center text-outline-dark text-light">
    <div>
      <label className="form-label fw-semibold text-sm">Sort by:</label>
      <select
        className="form-select form-select-sm"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as SortDate)}
      >
        <option value="newest">Date ↓</option>
        <option value="oldest">Date ↑</option>
      </select>
    </div>

    <div>
      <label className="form-label text-sm fw-semibold">Status:</label>
      <select
        className="form-select form-select-sm"
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(e.target.value as BookingStatus | "all")
        }
      >
        <option value="all">Any</option>
        {statuses.map((status: string) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="form-label text-sm me-2 fw-semibold">Restaurant:</label>
      <select
        className="form-select form-select-sm"
        value={restaurantFilter}
        onChange={(e) => setRestaurantFilter(e.target.value)}
      >
        <option value="all">All</option>
        {restaurants.map((name: string) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default BookingFilters;
