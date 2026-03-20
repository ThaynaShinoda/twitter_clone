/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
  useCallback,
} from "react";
import type { User } from "../types/User";
import api from "../services/api";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async () => {
    if (token) {
      try {
        const response = await api.get("profile/");
        setUser(response.data);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    const run = async () => {
      await fetchUser();
    };
    run();
  }, [fetchUser]);

  const login = async (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    await fetchUser();
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context == undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
