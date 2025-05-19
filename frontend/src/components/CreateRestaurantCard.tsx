import React from "react";

interface Props {
  onClick: () => void;
}

const CreateRestaurantCard: React.FC<Props> = ({ onClick }) => {
  return (
    <div
      className="card h-100 border-2 bg-light p-3"
      style={{ cursor: "pointer", opacity: 0.75 }}
      onClick={onClick}
    >
      <div className="card border d-flex justify-content-center border flex-grow-1 flex-column">
        <div className="display-4 text-secondary text-center">+</div>
        <p className="text-center mt-2 fw-bold text-secondary">
          Add Restaurant
        </p>
      </div>
    </div>
  );
};

export default CreateRestaurantCard;
