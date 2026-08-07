import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { API_BASE_URL } from "../services/apiConfig";
import AuthContext from "./AuthContextValue";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutRedirectPending, setLogoutRedirectPending] = useState(false);

  const checkLogin = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/protected`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.user) {
        setUser(data.user);
        setIsLoggedIn(true);
        setLogoutRedirectPending(false);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch {
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const verifyExistingSession = async () => {
      await checkLogin();
    };

    verifyExistingSession();
  }, [checkLogin]);

  const login = (authData) => {
    setUser(authData.user);
    setIsLoggedIn(true);
    setLogoutRedirectPending(false);
  };

  const completeLogoutRedirect = useCallback(() => {
    setLogoutRedirectPending(false);
  }, []);

  const logout = async (onLoggedOut) => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed. Please try again.");
    }

    flushSync(() => {
      setUser(null);
      setIsLoggedIn(false);
      setLogoutRedirectPending(true);
      onLoggedOut?.();
    });
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    logoutRedirectPending,
    completeLogoutRedirect,
    checkLogin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
