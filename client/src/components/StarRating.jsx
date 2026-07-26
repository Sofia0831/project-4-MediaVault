import React from "react";
import "./FormControls.css";

const StarRating = ({
  rating = 0,
  onChange,
  disabled = false,
  readOnly = false,
  label = "Rating",
}) => {
  const isDisabled = disabled || readOnly;

  const handleChange = (value) => {
    if (!isDisabled && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="rating-control" aria-label={label}>
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          className={`star-button ${value <= rating ? "selected" : ""}`}
          onClick={() => handleChange(value)}
          disabled={isDisabled}
          aria-label={`Set rating to ${value} ${value === 1 ? "star" : "stars"}`}
          aria-pressed={value === rating}
        >
          {value <= rating ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
};

export default StarRating;
