import { type User } from "@/interfaces/user";
import { redirect } from "react-router-dom";

export function adminLoader() {
  const userString = localStorage.getItem("user");

  if (!userString) {
    return redirect("/login");
  }

  try {
    const user: User = JSON.parse(userString);
    if (user?.role !== "ADMIN") {
      return redirect("/dashboard");
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    return redirect("/login");
  }

  // Si todo está bien, devuelve null y permite el acceso a la ruta
  return null;
}
