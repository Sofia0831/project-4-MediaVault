import React from "react";
import "./FormControls.css";

const statusOptions = [
  { value: "plan", label: "Plan to Watch/Read" },
  { value: "in_progress", label: "Currently Watching/Reading" },
  { value: "completed", label: "Completed" },
];

const StatusDropdown = ({
  status = "plan",
  onChange,
  disabled = false,
  label = "Media status",
}) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <label className="status-control">
      <span>{label}</span>
      <select
        value={status}
        onChange={handleChange}
        disabled={disabled}
        aria-label={label}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default StatusDropdown;
