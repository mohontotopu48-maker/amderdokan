import { NextResponse } from 'next/server'
import { ADMIN_COOKIE } from '@/lib/admin-auth'

export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 0,
  })
  return res
}
