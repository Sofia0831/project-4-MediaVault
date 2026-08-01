import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import useAuth from "./hooks/useAuth";
import Layout from "./components/Layout";
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

function AppRoutes() {
  const { isLoggedIn, user, loading } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              !isLoggedIn ? (
                <LandingPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              !isLoggedIn ? (
                <LoginPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/register"
            element={
              !isLoggedIn ? (
                <RegisterPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* Protected routes wrapped in Layout */}
          <Route
            element={
              isLoggedIn ? <Layout /> : <Navigate to="/login" replace />
            }
          >
            <Route path="/dashboard" element={<Dashboard user={user} />} />

            {/* Shelf & Shelf Media Details */}
            <Route path="/shelf" element={<Shelf />} />
            <Route path="/shelf/movies/:id" element={<MovieDetails />} />
            <Route path="/shelf/books/:id" element={<BookDetails />} />

            {/* General Discovery Catalogues & Details */}
            <Route path="/movies" element={<MovieCatalogue />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/books" element={<BookCatalogue />} />
            <Route path="/books/:id" element={<BookDetails />} />
          </Route>
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;