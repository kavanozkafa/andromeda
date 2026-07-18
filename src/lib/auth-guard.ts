import { redirect } from '@tanstack/react-router'

export function checkAuth() {
  if (typeof window === 'undefined') return

  const saved = localStorage.getItem('andromeda_user')
  if (!saved) {
    throw redirect({
      to: '/login',
    })
  }
}

export const protectedRouteOptions = {
  beforeLoad: checkAuth,
}
