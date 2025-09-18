import { createContext, useContext, useState, useEffect } from "react";
import api from "../Core/api/axiosInstance";

type User = {
  id: number;
  username: string;
  role: string;
};

type Session = {
  token: string;
  username: string;
  role: string;
} | null;

type AuthContextType = {
  user: Session;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Session>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth_data");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.token && parsed.username && parsed.role) {
          setUser(parsed);
        } else {
          localStorage.removeItem("auth_data");
        }
      } catch (error) {
        console.error("Failed to parse auth_data:", error);
        localStorage.removeItem("auth_data");
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await api.post("/login", { username, password });
      const data: User = res.data;

      const session: Session = {
        token: data.id.toString(), // Replace with proper JWT in production
        username: data.username,
        role: data.role,
      };

      localStorage.setItem("auth_data", JSON.stringify(session));
      setUser(session);
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_data");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}