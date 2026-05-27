'use client'

import { useEffect, useState } from 'react'
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
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40">
              <Grid3X3 className="size-5 text-green-600 dark:text-green-400" />
            </div>
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
                  className="animate-pulse rounded-xl bg-muted h-32 md:h-36"
                />
              ))
            : categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card
                    className="cursor-pointer border-0 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <CardContent className="p-0">
                      <div
                        className={`bg-gradient-to-br ${CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length]} p-4 md:p-5 flex flex-col items-center justify-center text-center min-h-[120px] md:min-h-[140px] group-hover:scale-105 transition-transform duration-300`}
                      >
                        <span className="text-3xl md:text-4xl mb-2">{category.icon || '🛒'}</span>
                        <h3 className="font-semibold text-sm md:text-base text-foreground leading-tight">
                          {language === 'bn' ? category.nameBn : category.nameEn}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {category._count?.products ?? 0} {language === 'bn' ? 'পণ্য' : 'items'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Button
            variant="outline"
            className="border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-500 dark:hover:text-white px-8"
            onClick={handleViewAll}
          >
            {language === 'bn' ? 'সব ক্যাটাগরি দেখুন' : 'View All Categories'}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
