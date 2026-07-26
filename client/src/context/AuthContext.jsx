import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const response = await fetch(
        "http://localhost:5050/api/auth/protected",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.user) {
        setUser(data.user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (authData) => {
    setUser(authData.user);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await fetch("http://localhost:5050/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    setIsLoggedIn(false);
  };

  const value = {
    user,
    isLoggedIn,
    loading,
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
