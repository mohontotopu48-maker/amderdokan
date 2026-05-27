'use client'

import { useState } from 'react'
import { useStore } from '@/store/use-store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Lock, Shield, Eye, EyeOff, Store } from 'lucide-react'

export function AdminLogin() {
  const { setIsAdminMode, language } = useStore()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isBn = language === 'bn'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (password === 'admin123') {
      setIsAdminMode(true)
    } else {
      setError(isBn ? 'ভুল পাসওয়ার্ড। আবার চেষ্টা করুন।' : 'Wrong password. Try again.')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-orange-50 dark:from-green-950/30 dark:via-background dark:to-orange-950/20 p-4">
      <Card className="w-full max-w-md shadow-xl border-green-200/50 dark:border-green-800/30">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
            <Store className="size-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                {isBn ? 'আমাদের বাজার' : 'Amar Bazar'}
              </span>
            </CardTitle>
            <CardDescription className="mt-1 text-sm">
              {isBn ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Shield className="size-4 text-green-600" />
                <span>{isBn ? 'অ্যাডমিন পাসওয়ার্ড' : 'Admin Password'}</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder={isBn ? 'পাসওয়ার্ড লিখুন' : 'Enter password'}
                  className="pl-9 pr-10 h-11"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-md px-3 py-2 border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-500/25 transition-all"
              disabled={isLoading || !password}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isBn ? 'যাচাই করা হচ্ছে...' : 'Verifying...'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="size-4" />
                  <span>{isBn ? 'প্রবেশ করুন' : 'Login'}</span>
                </div>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              {isBn
                ? 'ডেমো পাসওয়ার্ড: admin123'
                : 'Demo password: admin123'}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
