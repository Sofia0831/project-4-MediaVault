import React from "react";
import "./StatusModal.css";

const STATUS_OPTIONS = [
  "Plan to Read",
  "Reading",
  "Completed",
  "Dropped",
];

const BookStatusModal = ({ isOpen, onClose, onSelectStatus, currentStatus }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Select Status</h3>
        <p className="modal-subtitle">Assign a tag or status to this item</p>

        <div className="status-options">
          {STATUS_OPTIONS.map((status) => {
            const isSelected = status === currentStatus;
            return (
              <button
                key={status}
                className={`modal-option-btn ${isSelected ? "selected" : ""}`}
                onClick={() => onSelectStatus(status)}
              >
                {status} {isSelected && "✓"}
              </button>
            );
          })}
        </div>

        <button className="cancel-btn modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default BookStatusModal;