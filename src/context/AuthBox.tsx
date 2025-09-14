import { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};

type Session = {
  token: string;
  username: string;
  role: string;
} | null;

type AuthContextType = {
  user: Session;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
};

const AuthCtx = createContext<AuthContextType | undefined>(undefined);

export function AuthBoxProvider({ children }: { children: React.ReactNode }) {
  const [activeUser, setActiveUser] = useState<Session>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth_data");
    if (stored) {
      setActiveUser(JSON.parse(stored));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch(`http://localhost:4000/users?username=${username}&password=${password}`);
    const data: User[] = await res.json();

    if (!data.length) throw new Error("Invalid credentials");

    const found = data[0];
    const session: Session = {
      token: Math.random().toString(36).substring(2),
      username: found.username,
      role: found.role,
    };

    localStorage.setItem("auth_data", JSON.stringify(session));
    setActiveUser(session);
  };

  const logout = () => {
    localStorage.removeItem("auth_data");
    setActiveUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user: activeUser, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthBoxProvider");
  return ctx;
}
