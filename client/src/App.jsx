import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import useAuth from "./hooks/useAuth";
import Layout from "./components/Layout";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const Shelf = lazy(() => import("./pages/Shelf"));
const MovieCatalogue = lazy(() => import("./pages/MovieCatalogue"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const BookCatalogue = lazy(() => import("./pages/BookCatalogue"));
const BookDetails = lazy(() => import("./pages/BookDetails"));
const SavedMediaDetails = lazy(() => import("./pages/SavedMediaDetails"));

function AppRoutes() {
  const { isLoggedIn, user, loading } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Router>
      <div className="app-container">
        <Suspense
          fallback={(
            <main className="route-loading" role="status" aria-live="polite">
              Loading page…
            </main>
          )}
        >
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                !isLoggedIn ? <LandingPage /> : <Navigate to="/dashboard" replace />
              }
            />
            <Route
              path="/login"
              element={
                !isLoggedIn ? <LoginPage /> : <Navigate to="/dashboard" replace />
              }
            />
            <Route
              path="/register"
              element={
                !isLoggedIn ? <RegisterPage /> : <Navigate to="/dashboard" replace />
              }
            />

            {/* Protected routes wrapped in Layout */}
            <Route
              element={
                isLoggedIn ? <Layout /> : <Navigate to="/login" replace />
              }
            >
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/shelf" element={<Shelf />} />
              <Route path="/shelf/:id" element={<SavedMediaDetails />} />
              <Route path="/movies" element={<MovieCatalogue />} />
              <Route path="/movies/:id" element={<MovieDetails />} />
              <Route path="/books" element={<BookCatalogue />} />
              <Route path="/books/:id" element={<BookDetails />} />
            </Route>

            {/* Fallback redirect for unknown paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

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
