import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import HeaderNav from "./components/HeaderNav";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Shelf from "./pages/Shelf";
import MovieCatalogue from "./pages/MovieCatalogue";
import MovieDetails from "./pages/MovieDetails";
import BookCatalogue from "./pages/BookCatalogue";
import BookDetails from "./pages/BookDetails";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <div className="app-container">
        <HeaderNav isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route 
            path="/login" 
            element={!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />} 
          />

          <Route 
            path="/register" 
            element={!isLoggedIn ? <RegisterPage onRegister={handleLogin} /> : <Navigate to="/dashboard" replace />} 
          />
          
          <Route 
            path="/dashboard" 
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} 
          />

          <Route path="/shelf" 
          element={isLoggedIn ? <Shelf /> : <Navigate to="/login" replace />} 
          />

          <Route path="/movies" 
          element={isLoggedIn ? <MovieCatalogue /> : <Navigate to="/login" replace />} 
          />

          <Route path="/movies/:id" 
          element={isLoggedIn ? <MovieDetails /> : <Navigate to="/login" replace />} 
          />

          <Route path="/books" 
          element={isLoggedIn ? <BookCatalogue /> : <Navigate to="/login" replace />} 
          />

          <Route path="/books/:id" 
          element={isLoggedIn ? <BookDetails /> : <Navigate to="/login" replace />} 
          />

        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;