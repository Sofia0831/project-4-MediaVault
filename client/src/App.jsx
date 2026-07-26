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
import HeaderNav from "./components/HeaderNav";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Shelf from "./pages/Shelf";
import MovieCatalogue from "./pages/MovieCatalogue";
import MovieDetails from "./pages/MovieDetails";


function AppRoutes() {
  const { isLoggedIn, user, loading } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Router>
      <div className="app-container">
        <HeaderNav />

        <Routes>
          <Route path="/" element={!isLoggedIn ? (
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

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
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
