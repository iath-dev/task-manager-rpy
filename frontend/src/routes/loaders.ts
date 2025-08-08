import { redirect } from "react-router-dom";

// TODO: Replace with a more robust user object parsing and validation
interface User {
  role: string;
}

export function adminLoader() {
  const userString = localStorage.getItem("user"); // Asumiendo que el objeto de usuario se guarda aquí

  if (!userString) {
    return redirect("/login");
  }

  try {
    const user: User = JSON.parse(userString);
    if (user?.role !== "admin") {
      // Si no es admin, redirigir a una página de "no autorizado" o al dashboard
      return redirect("/dashboard");
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    return redirect("/login");
  }

  // Si todo está bien, devuelve null y permite el acceso a la ruta
  return null;
}
