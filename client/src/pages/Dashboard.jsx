import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <main className="dashboard-page">
      <section className="dashboard-content">
        <div className="quote-box">
          <h2>Insert Quote Here</h2>
        </div>

        <div className="grid-container">
          <div className="media-card">
            <div className="card-header"><h3>Top 10 Movies</h3></div>
            <div className="card-body"><button className="action-btn">Add Movies</button></div>
          </div>

          <div className="media-card">
            <div className="card-header"><h3>Top 10 Books</h3></div>
            <div className="card-body"><button className="action-btn">Add Books</button></div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;