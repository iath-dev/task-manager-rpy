import { create } from "zustand";

import type { User } from "@/interfaces/user";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setToken: (user: User, token: string) => void;
}

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  setToken: () => {},
  reset: () => {},
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialAuthState,
  login: (user, token) => {
    set({ user, token, isAuthenticated: true });
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(user));
  },
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  },
  setToken: (user, token) => {
    set({ user, token, isAuthenticated: true });
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(user));
  },
  reset: () => {
    set(initialAuthState);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  },
}));

// Opcional: Inicializar el store con datos del localStorage al cargar la aplicación
const initializeAuthStore = () => {
  const storedToken = localStorage.getItem("authToken");
  const storedUser = localStorage.getItem("authUser");

  if (storedToken && storedUser) {
    try {
      const user: User = JSON.parse(storedUser);
      useAuthStore.setState({
        user,
        token: storedToken,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Failed to parse stored user data:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    }
  }
};

initializeAuthStore();
