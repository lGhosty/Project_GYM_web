export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api'

export function getToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return localStorage.getItem('token')
}

export function getUsuario() {
  if (typeof window === 'undefined') {
    return null
  }

  const usuario = localStorage.getItem('usuario')

  if (!usuario) {
    return null
  }

  try {
    return JSON.parse(usuario)
  } catch {
    return null
  }
}

export function getAuthHeaders() {
  const token = getToken()

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}