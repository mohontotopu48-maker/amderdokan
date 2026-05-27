'use client'

import { useEffect } from 'react'
import { HeroSection } from './hero-section'
import { CategorySection } from './category-section'
import { TrendingProducts } from './trending-products'
import { PromoBanner } from './promo-banner'
import { FeaturedProducts } from './featured-products'
import { TrustBadges } from './trust-badges'
import { CustomerReviews } from './customer-reviews'
import { OwnerStatement } from './owner-statement'
import { ChatWidget } from '@/components/chat/chat-widget'
import { useStore } from '@/store/use-store'

export function Homepage() {
  const { categories, setCategories } = useStore()

  // Pre-fetch categories on mount if not already loaded
  useEffect(() => {
    if (categories.length > 0) return

    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data.categories)
        }
      } catch (error) {
        console.error('Failed to fetch initial categories:', error)
      }
    }

    fetchCategories()
  }, [categories.length, setCategories])

  return (
    <main className="min-h-screen">
      <HeroSection />
      <CategorySection />
      <TrendingProducts />
      <PromoBanner />
      <FeaturedProducts />
      <TrustBadges />
      <CustomerReviews />
      <OwnerStatement />
      <ChatWidget />
    </main>
  )
}
