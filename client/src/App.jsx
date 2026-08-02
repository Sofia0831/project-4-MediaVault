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
import SavedMediaDetails from "./pages/SavedMediaDetails";

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
          />

          <Route path="/shelf"
          element={isLoggedIn ? <Shelf /> : <Navigate to="/login" replace />}
          />

          <Route path="/shelf/:id"
          element={isLoggedIn ? <SavedMediaDetails /> : <Navigate to="/login" replace />}
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

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;