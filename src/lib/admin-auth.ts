import { cookies } from 'next/headers'

const ADMIN_PASSWORD = 'admin123'
const ADMIN_COOKIE = 'admin_session'

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE)
  return session?.value === 'authenticated'
}

export { ADMIN_PASSWORD, ADMIN_COOKIE }
