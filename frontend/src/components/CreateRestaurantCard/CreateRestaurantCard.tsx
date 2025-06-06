import React from "react";
import styles from "./CreateRestaurantCard.module.css";

interface Props {
  onClick: () => void;
}

const CreateRestaurantCard: React.FC<Props> = ({ onClick }) => {
  return (
    <div
      className={`card border-2 bg-light p-3 m-auto ${styles.card_custom}`}
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
