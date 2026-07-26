import React from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <main className="dashboard-page">
      <section className="dashboard-content">
        <div className="quote-box">
          <h2>Insert Quote Here</h2>
        </div>

        <div className="grid-container">
          <div className="media-card">
            <div className="card-header"><h3>Top 10 Movies</h3></div>
            <div className="card-body"><button className="action-btn" onClick={() => navigate("/movies")}>Add Movies</button></div>
          </div>

          <div className="media-card">
            <div className="card-header"><h3>Top 10 Books</h3></div>
            <div className="card-body"><button className="action-btn" onClick={() => navigate("/books")}>Add Books</button></div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;