import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBreadcrumb } from "../context/BreadcrumbContext";
import "./Breadcrumbs.css";

const ROUTE_NAME_MAP = {
  shelf: "My Shelf",
  movies: "Movies",
  books: "Books",
  dashboard: "Dashboard",
};

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { breadcrumbTitle } = useBreadcrumb();

  const isDashboard =
    location.pathname === "/dashboard" || location.pathname === "/";

  // Check if navigation explicitly came from the Dashboard
  const isFromDashboard = location.state?.from === "dashboard";

  // No breadcrumb nav on dashboard
  if (isDashboard) {
    return null;
  }

  const rawSegments = location.pathname.split("/").filter((x) => x);

  const formattedSegments = rawSegments.filter((segment, idx) => {
    const lower = segment.toLowerCase();
    if (lower === "dashboard") return false;

    if (
      idx > 0 &&
      rawSegments[idx - 1].toLowerCase() === "shelf" &&
      (lower === "movies" || lower === "books") &&
      rawSegments.length > idx + 1
    ) {
      return false;
    }

    // hide "shelf" segment if from the Dashboard
    if (
      isFromDashboard &&
      lower === "shelf" &&
      rawSegments.length > idx + 1
    ) {
      return false;
    }

    return true;
  });

  return (
    <nav aria-label="breadcrumb" className="breadcrumbs-container">
      <div className="breadcrumbs-wrapper">
        <button
          type="button"
          className="breadcrumb-back-btn"
          onClick={() => navigate(-1)}
          title="Go to previous page"
        >
          &larr; Back
        </button>

        <span className="breadcrumb-divider">|</span>

        <ol className="breadcrumbs-list">
          <li className="breadcrumb-item">
            <Link to="/dashboard">Dashboard</Link>
          </li>

          {formattedSegments.map((value, index) => {
            const rawIndex = rawSegments.lastIndexOf(value);
            const to = `/${rawSegments.slice(0, rawIndex + 1).join("/")}`;
            const isLast = index === formattedSegments.length - 1;

            let label = ROUTE_NAME_MAP[value.toLowerCase()] || value;

            if (isLast && breadcrumbTitle) {
              label = breadcrumbTitle;
            } else if (!ROUTE_NAME_MAP[value.toLowerCase()]) {
              label = value.charAt(0).toUpperCase() + value.slice(1);
            }

            return (
              <React.Fragment key={to}>
                <span className="breadcrumb-separator">/</span>
                <li
                  className={`breadcrumb-item ${isLast ? "active" : ""}`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {isLast ? (
                    <span className="breadcrumb-current">{label}</span>
                  ) : (
                    <Link to={to}>{label}</Link>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;