import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBreadcrumb } from "../context/BreadcrumbContext";
import "./Breadcrumbs.css";

const ROUTE_NAME_MAP = {
  shelf: "My Shelf",
  movies: "Movies",
  books: "Books",
  search: "Search",
  dashboard: "Dashboard",
};

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { breadcrumbTitle } = useBreadcrumb();

  const rawPathnames = location.pathname.split("/").filter((x) => x);
  const pathnames = rawPathnames.filter(
    (segment) => segment.toLowerCase() !== "dashboard"
  );

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
            {location.pathname === "/dashboard" || location.pathname === "/" ? (
              <span className="breadcrumb-current">Dashboard</span>
            ) : (
              <Link to="/dashboard">Dashboard</Link>
            )}
          </li>

          {pathnames.map((value, index) => {
            const to = `/${rawPathnames
              .slice(0, rawPathnames.indexOf(value) + 1)
              .join("/")}`;
            const isLast = index === pathnames.length - 1;

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