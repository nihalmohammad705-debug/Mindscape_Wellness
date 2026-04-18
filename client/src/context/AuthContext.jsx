import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:5000/api/auth";

  // Validate token with server
  const validateToken = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/validate-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        return { valid: true, user: data.user };
      } else {
        return { valid: false };
      }
    } catch (err) {
      return { valid: false };
    }
  };

  // Load and validate stored user from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("mindscape_token");
      const userData = localStorage.getItem("mindscape_user");
      
      if (token && userData) {
        // Validate token with server on app start
        const validation = await validateToken(token);
        if (validation.valid) {
          setUser(validation.user);
          // Update stored user data with fresh data from server
          localStorage.setItem("mindscape_user", JSON.stringify(validation.user));
        } else {
          // Token is invalid, clear storage
          clearAuthData();
        }
      }
      setLoading(false);
    };

    initAuth();

    // Set up periodic token validation (every 5 minutes)
    const interval = setInterval(async () => {
      const token = localStorage.getItem("mindscape_token");
      if (token && user) {
        const validation = await validateToken(token);
        if (!validation.valid) {
          clearAuthData();
          setUser(null);
          // Optional: Redirect to login page or show notification
          console.log("Session expired. Please login again.");
          window.location.href = '/login';
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Clear all auth data
  const clearAuthData = () => {
    localStorage.removeItem("mindscape_token");
    localStorage.removeItem("mindscape_user");
  };

  // ✅ REGISTER
  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, data };
      } else {
        return {
          success: false,
          error: data.error || data.message || "Registration failed",
        };
      }
    } catch (err) {
      return { success: false, error: "Network error: " + err.message };
    }
  };

  // ✅ LOGIN
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("mindscape_token", data.token);
        localStorage.setItem("mindscape_user", JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return {
          success: false,
          error: data.error || data.message || "Invalid credentials",
        };
      }
    } catch (err) {
      return { success: false, error: "Network error: " + err.message };
    }
  };

  // ✅ VERIFY USER (for password reset)
  const verifyUser = async (email, uniqueId) => {
    try {
      const res = await fetch(`${API_BASE}/verify-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, uniqueId }),
      });
      const data = await res.json();
      return res.ok
        ? { success: true, data }
        : { success: false, error: data.error || data.message };
    } catch (err) {
      return { success: false, error: "Network error: " + err.message };
    }
  };

  // ✅ RESET PASSWORD
  const resetPassword = async (userId, newPassword) => {
    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPassword }),
      });
      const data = await res.json();
      return res.ok
        ? { success: true, data }
        : { success: false, error: data.error || data.message };
    } catch (err) {
      return { success: false, error: "Network error: " + err.message };
    }
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    verifyUser,
    resetPassword,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};