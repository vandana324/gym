import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get("/auth/me");
          setUser(res.data);
        } catch (err) {
          console.error("Failed to fetch user:", err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

      const userRes = await axios.get("/auth/me");
      setUser(userRes.data);

      return userRes.data;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
