const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!apiBaseUrl) {
  throw new Error(
    'VITE_API_BASE_URL no está configurada. Definí la URL base de la API antes de iniciar la aplicación.',
  )
}

export const API_BASE_URL = apiBaseUrl.replace(/\/$/, '')
