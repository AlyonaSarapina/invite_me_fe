import Skeleton from "react-loading-skeleton";

const BookingItemSkeleton = () => {
  return (
    <div className="card p-3 mb-3 shadow-sm rounded-4">
      <div className="d-flex justify-content-between align-items-center">
        <Skeleton width={150} height={24} />
        <Skeleton width={80} height={24} />
      </div>
      <Skeleton width={200} height={20} className="mt-2" />
      <Skeleton width={250} height={20} />
      <div className="d-flex gap-2 mt-3">
        <Skeleton width={100} height={32} />
        <Skeleton width={100} height={32} />
      </div>
    </div>
  );
};

export default BookingItemSkeleton;
