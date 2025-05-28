import Skeleton from "react-loading-skeleton";

const RestaurantSkeleton = () => {
  return (
    <div className="container d-flex flex-column py-5">
      <div className="mb-4 align-self-start">
        <Skeleton width={80} height={36} />
      </div>

      <div
        className="card p-4 align-self-center rounded-4"
        style={{ maxWidth: "700px" }}
      >
        <div className="d-flex flex-md-row gap-4">
          <Skeleton height={200} width={200} />
          <div className="flex-grow-1 d-flex flex-column gap-2">
            <Skeleton width={200} height={32} />
            <Skeleton width={150} height={20} />
            <Skeleton width={120} height={20} />
            <Skeleton width={100} height={24} />
            <Skeleton width={250} height={20} />
            <Skeleton width={300} height={20} />
            <div className="d-flex gap-3">
              <Skeleton width={100} height={32} />
              <Skeleton width={100} height={32} />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <Skeleton width={120} height={24} />
          <Skeleton count={3} />
        </div>

        <div className="mt-3">
          <Skeleton width={120} height={24} />
          <Skeleton height={200} />
        </div>
      </div>
    </div>
  );
};

export default RestaurantSkeleton;
