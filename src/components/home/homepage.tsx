'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, MapPin, Clock, TrendingUp } from 'lucide-react'
import { HeroSection } from './hero-section'
import { ServicesMarquee } from './services-marquee'
import { CategorySection } from './category-section'
import { BillPaymentSection } from '@/components/bill-payment/bill-payment-section'
import { TrendingProducts } from './trending-products'
import { PromoBanner } from './promo-banner'
import { FeaturedProducts } from './featured-products'
import { TrustBadges } from './trust-badges'
import { CustomerReviews } from './customer-reviews'
import { OwnerStatement } from './owner-statement'
import { ChatWidget } from '@/components/chat/chat-widget'
import { useStore } from '@/store/use-store'
import { Button } from '@/components/ui/button'

// Live order notification data
const LIVE_ORDERS_BN = [
  'রহিমা বেগম অর্ডার করেছেন - তাজা শাকসবজি',
  'করিম সাহেব অর্ডার করেছেন - চাল ও ডাল',
  'ফাতেমা আক্তার অর্ডার করেছেন - ফলমূল',
  'আব্দুল্লাহ অর্ডার করেছেন - মাছ ও মাংস',
  'নাসরিন অর্ডার করেছেন - দুগ্ধ ও ডিম',
  'মোস্তফা অর্ডার করেছেন - মসলা',
  'সাবরিনা অর্ডার করেছেন - স্ন্যাকস',
  'ইমরান অর্ডার করেছেন - পানীয়',
]

const LIVE_ORDERS_EN = [
  'Rahima Begum ordered - Fresh Vegetables',
  'Karim Sahib ordered - Rice & Lentils',
  'Fatema Akter ordered - Fruits',
  'Abdullah ordered - Fish & Meat',
  'Nasrin ordered - Dairy & Eggs',
  'Mostafa ordered - Spices',
  'Sabrina ordered - Snacks',
  'Imran ordered - Beverages',
]

export function Homepage() {
  const { categories, setProducts, setCategories, language, getCartItemCount, cart, setCurrentView } = useStore()
  const [liveOrderIndex, setLiveOrderIndex] = useState(0)
  const [showLiveOrder, setShowLiveOrder] = useState(false)

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

  // Live order notification ticker (competitor pattern from Daraz/Chaldal)
  useEffect(() => {
    const interval = setInterval(() => {
      setShowLiveOrder(true)
      setTimeout(() => setShowLiveOrder(false), 3500)
      setLiveOrderIndex((prev) => (prev + 1) % LIVE_ORDERS_BN.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const cartItemCount = getCartItemCount()
  const isBn = language === 'bn'
  const liveOrders = isBn ? LIVE_ORDERS_BN : LIVE_ORDERS_EN

  return (
    <main className="min-h-screen relative">
      {/* Background pattern overlay for the entire page */}
      <div className="fixed inset-0 pointer-events-none bg-pattern-home" />

      <HeroSection />
      <ServicesMarquee />
      <CategorySection />
      <BillPaymentSection />
      <TrendingProducts />
      <PromoBanner />
      <FeaturedProducts />
      <TrustBadges />
      <CustomerReviews />
      <OwnerStatement />
      <ChatWidget />

      {/* Live Order Notification - Social proof (like Chaldal/Daraz) */}
      <AnimatePresence>
        {showLiveOrder && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed bottom-24 left-4 z-30 max-w-[280px] bg-white dark:bg-card border border-green-200 dark:border-green-800 rounded-xl shadow-xl p-3 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
              <ShoppingBag className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 truncate">
                🔥 {isBn ? 'এইমাত্র অর্ডার!' : 'Just Ordered!'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {liveOrders[liveOrderIndex]}
              </p>
              <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1 mt-0.5">
                <MapPin className="size-2.5" />
                Mohammadpur, Dhaka
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Sticky Cart Bar (like Chaldal) */}
      {cartItemCount > 0 && (
        <div className="bottom-cart-bar md:hidden bg-white/95 dark:bg-card/95 border-t border-green-200 dark:border-green-800 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] px-4 py-2.5">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-11 text-sm gap-2"
            onClick={() => useStore.getState().setIsCartOpen(true)}
          >
            <ShoppingBag className="size-4" />
            {isBn ? `কার্ট দেখুন` : 'View Cart'}
            <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs font-bold">
              {cartItemCount} {isBn ? 'আইটেম' : 'items'}
            </span>
          </Button>
        </div>
      )}
    </main>
  )
}
