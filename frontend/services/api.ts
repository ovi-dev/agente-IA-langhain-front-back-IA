/**
 * api.ts
 * ──────
 * Instancia base de Axios con interceptores para:
 *  - Añadir headers comunes (Authorization si hay token)
 *  - Manejar errores globalmente (401 → limpiar sesión, etc.)
 */
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Si en el futuro usas JWT, añadirías el token aquí:
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Aquí podrías redirigir al login o limpiar tokens
      console.warn("No autorizado. Verifica tus credenciales.");
    }
    return Promise.reject(error);
  },
);
