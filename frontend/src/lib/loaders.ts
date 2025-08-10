import { redirect } from "react-router-dom";
import apiClient from "@/services/api";
import { type User } from "@/interfaces/user";

// --- Mejora de Rendimiento: Cache en Memoria ---
// Esta variable guardará los datos del usuario durante la sesión de la aplicación.
// Solo se volverá a llamar al backend si se recarga toda la página.
let userData: User | null = null;

/**
 * Loader para verificar la autenticación del usuario.
 * Llama al endpoint /auth/me solo si los datos del usuario no están en caché.
 */
export async function authLoader() {
  if (userData) {
    return userData;
  }

  try {
    const res = await apiClient.get("/auth/me");
    userData = res.data;
    return userData;
  } catch (err) {
    console.error("Authentication check failed:", err);
    userData = null; // Limpiar caché en caso de error
    return redirect("/auth");
  }
}

/**
 * Loader para proteger rutas que solo son para administradores.
 * Debe usarse en una ruta anidada bajo una ruta que ya use `authLoader`.
 */
export async function adminLoader() {
  if (userData?.role !== "ADMIN") {
    // Si el usuario en caché no es admin, se le deniega el acceso.
    return redirect("/dashboard");
  }
  return null;
}
