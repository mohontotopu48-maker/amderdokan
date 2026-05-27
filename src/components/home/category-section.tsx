'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Grid3X3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStore, type Category } from '@/store/use-store'

const CATEGORY_GRADIENTS = [
  'from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-900/30',
  'from-orange-50 to-amber-100 dark:from-orange-950/50 dark:to-amber-900/30',
  'from-lime-50 to-green-100 dark:from-lime-950/50 dark:to-green-900/30',
  'from-yellow-50 to-orange-100 dark:from-yellow-950/50 dark:to-orange-900/30',
  'from-emerald-50 to-teal-100 dark:from-emerald-950/50 dark:to-teal-900/30',
  'from-amber-50 to-yellow-100 dark:from-amber-950/50 dark:to-yellow-900/30',
  'from-teal-50 to-cyan-100 dark:from-teal-950/50 dark:to-cyan-900/30',
  'from-rose-50 to-orange-100 dark:from-rose-950/50 dark:to-orange-900/30',
  'from-green-50 to-lime-100 dark:from-green-950/50 dark:to-lime-900/30',
  'from-orange-50 to-red-100 dark:from-orange-950/50 dark:to-red-900/30',
  'from-emerald-50 to-green-100 dark:from-emerald-950/50 dark:to-green-900/30',
  'from-amber-50 to-orange-100 dark:from-amber-950/50 dark:to-orange-900/30',
]

// 3D Tilt Card Component
function TiltCard({
  children,
  className,
  onClick,
  index,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8
    cardRef.current.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)'
  }, [])

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setRipple({ x, y, id: Date.now() })
    setTimeout(() => setRipple(null), 600)
    onClick?.()
  }, [onClick])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.06, type: 'spring', stiffness: 150, damping: 20 }}
      whileHover={{ zIndex: 10 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative overflow-hidden cursor-pointer transition-all duration-200 ease-out border-2 border-transparent animate-gradient-border rounded-xl ${className || ''}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
      {/* Ripple Effect */}
      {ripple && (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
          }}
        />
      )}
    </motion.div>
  )
}

export function CategorySection() {
  const { language, categories, setCategories, setSelectedCategoryId, setCurrentView } = useStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (categories.length > 0) return

    const fetchCategories = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data.categories)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [categories.length, setCategories])

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setCurrentView('products')
  }

  const handleViewAll = () => {
    setSelectedCategoryId(null)
    setCurrentView('products')
  }

  return (
    <section className="py-12 md:py-16 relative">
      {/* Decorative pattern background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "url('/bg-home.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40"
            >
              <Grid3X3 className="size-5 text-green-600 dark:text-green-400" />
            </motion.div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {language === 'bn' ? 'ক্যাটাগরি অনুযায়ী কেনাকাটা করুন' : 'Shop by Category'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'আপনার প্রয়োজনীয় পণ্য সহজে খুঁজুন' : 'Find what you need easily'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            onClick={handleViewAll}
          >
            {language === 'bn' ? 'সব দেখুন' : 'View All'}
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl bg-muted h-32 md:h-36 relative overflow-hidden"
                >
                  <div className="absolute inset-0 animate-shimmer" />
                </div>
              ))
            : categories.map((category, index) => (
                <TiltCard
                  key={category.id}
                  index={index}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow duration-300 group overflow-hidden h-full">
                    <CardContent className="p-0">
                      <div
                        className={`bg-gradient-to-br ${CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length]} p-4 md:p-5 flex flex-col items-center justify-center text-center min-h-[120px] md:min-h-[140px] transition-transform duration-300`}
                      >
                        <motion.span
                          className="text-3xl md:text-4xl mb-2 block"
                          whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        >
                          {category.icon || '🛒'}
                        </motion.span>
                        <h3 className="font-semibold text-sm md:text-base text-foreground leading-tight">
                          {language === 'bn' ? category.nameBn : category.nameEn}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {category._count?.products ?? 0} {language === 'bn' ? 'পণ্য' : 'items'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              ))}
        </div>

        {/* View All Button with Arrow Animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Button
            variant="outline"
            className="border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-500 dark:hover:text-white px-8 group"
            onClick={handleViewAll}
          >
            {language === 'bn' ? 'সকল বিভাগ দেখুন' : 'View All Categories'}
            <motion.span
              className="ml-2 inline-flex"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight className="size-4" />
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
