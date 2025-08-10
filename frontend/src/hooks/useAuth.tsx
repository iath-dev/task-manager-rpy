import { useAuthStore } from "@/store/authStore";
import { useMemo } from "react";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isAdmin = useMemo(() => {
    return user?.role === "ADMIN";
  }, [user]);

  return { user, isAuthenticated, isAdmin };
};
