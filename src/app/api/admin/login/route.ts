import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_PASSWORD, ADMIN_COOKIE } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    if (password === ADMIN_PASSWORD) {
      const res = NextResponse.json({ success: true })
      res.cookies.set(ADMIN_COOKIE, 'authenticated', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      })
      return res
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
