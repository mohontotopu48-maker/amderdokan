'use client'

import React from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Homepage } from '@/components/home/homepage'
import { ProductDetail } from '@/components/product/product-detail'
import { ProductGrid } from '@/components/product/product-grid'
import { CartSheet } from '@/components/cart/cart-sheet'
import { CheckoutDialog } from '@/components/checkout/checkout-dialog'
import { BillPaymentDialog } from '@/components/bill-payment/bill-payment-dialog'
import { SearchDialog } from '@/components/search/search-dialog'
import { AdminLogin } from '@/components/admin/admin-login'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { ChatWidget } from '@/components/chat/chat-widget'
import { useStore } from '@/store/use-store'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ShoppingBag, Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { motion, AnimatePresence } from 'framer-motion'

function ProductsView() {
  const { language, categories, products, setProducts, setCategories, selectedCategoryId, searchQuery } = useStore()
  const isBn = language === 'bn'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        // Use category slug for API filter (API expects slug, not ID)
        if (selectedCategoryId) {
          const cat = categories.find(c => c.id === selectedCategoryId)
          if (cat?.slug) {
            params.set('category', cat.slug)
          }
        }
        if (searchQuery) params.set('search', searchQuery)
        params.set('limit', '50')

        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`/api/products?${params.toString()}`),
          categories.length > 0 ? Promise.resolve(null) : fetch('/api/categories')
        ])

        if (productsRes?.ok) {
          const data = await productsRes.json()
          setProducts(data.products || [])
        }

        if (categoriesRes?.ok) {
          const data = await categoriesRes.json()
          setCategories(data.categories || [])
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedCategoryId, searchQuery, categories, setProducts, setCategories])

  const selectedCategory = categories.find(c => c.id === selectedCategoryId)
  const title = selectedCategory
    ? (isBn ? selectedCategory.nameBn : selectedCategory.nameEn)
    : searchQuery
    ? (isBn ? `"${searchQuery}" এর ফলাফল` : `Results for "${searchQuery}"`)
    : (isBn ? 'সকল পণ্য' : 'All Products')

  if (loading) {
    return (
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
      <ProductGrid
        title={title}
        products={products}
      />
    </div>
  )
}

function AboutView() {
  const { language } = useStore()
  const isBn = language === 'bn'

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <Store className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
          {isBn ? 'আমাদের সম্পর্কে' : 'About Us'}
        </h1>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border border-border">
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">
            {isBn ? 'আমাদের বাজার' : 'Amar Bazar'}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {isBn
              ? 'আমাদের বাজার মোহাম্মদপুর, ঢাকায় অবস্থিত একটি বিশ্বস্ত অনলাইন গ্রোসারি শপ। আমরা আমাদের এলাকার মানুষদের জন্য তাজা শাকসবজি, ফলমূল, মাছ, মাংস এবং দৈনন্দিন প্রয়োজনীয় সব পণ্য সরবরাহ করি। ১ ঘণ্টায় দ্রুত ডেলিভারি এবং সেরা দামের গ্যারান্টি দিই।'
              : 'Amar Bazar is a trusted online grocery shop located in Mohammadpur, Dhaka. We supply fresh vegetables, fruits, fish, meat and all daily essentials for our local community. We guarantee 1-hour fast delivery and the best prices.'}
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">
                {isBn ? 'ঠিকানা' : 'Address'}
              </h3>
              <p className="text-muted-foreground text-sm">
                Mohammadpur Housing, Limited Art,<br />
                House Number 123, Dhaka 1207
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">
                {isBn ? 'মালিক' : 'Owner'}
              </h3>
              <p className="text-muted-foreground text-sm">
                নিবির হোসেন (Nibir Hossain)<br />
                {isBn ? 'সম্মানিত স্থানীয় ব্যবসায়ী' : 'Respected Local Businessman'}
              </p>
            </div>
          </div>

          <blockquote className="border-l-4 border-green-500 pl-4 py-2 my-6 bg-green-50/50 dark:bg-green-900/10 rounded-r-lg">
            <p className="text-lg font-medium italic text-green-700 dark:text-green-400">
              "আমাদের বাজার শুধু একটি দোকান নয়, এটি আমাদের এলাকার মানুষের জন্য নির্ভরতার একটি নাম।"
            </p>
            <cite className="text-sm text-muted-foreground mt-2 block">
              — নিবির হোসেন
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  )
}

export function MainLayout() {
  const {
    currentView,
    setCurrentView,
    isAdminMode,
    setIsAdminMode,
    selectedProductId,
  } = useStore()

  const renderView = () => {
    // Admin mode
    if (currentView === 'admin') {
      if (!isAdminMode) {
        return <AdminLogin />
      }
      return <AdminDashboard />
    }

    switch (currentView) {
      case 'home':
        return <Homepage />
      case 'products':
        return <ProductsView />
      case 'product-detail':
        return selectedProductId ? (
          <ProductDetail />
        ) : (
          <ProductsView />
        )
      case 'about':
        return <AboutView />
      default:
        return <Homepage />
    }
  }

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  }

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.25,
  }

  const showBackButton = currentView !== 'home' && currentView !== 'admin'
  const showAdminButton = currentView === 'home'

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col">
        {/* Back navigation for sub-views */}
        {showBackButton && (
          <div className="bg-muted/30 border-b border-border">
            <div className="max-w-7xl mx-auto w-full px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCurrentView('home')
                }}
                className="text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentView === 'product-detail' ? 'পণ্য তালিকায় ফিরুন' : 'হোমে ফিরুন'}
              </Button>
            </div>
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + (selectedProductId || '')}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="flex-1 flex flex-col"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />

      {/* Global overlays */}
      <CartSheet />
      <CheckoutDialog />
      <BillPaymentDialog />
      <SearchDialog />

      {/* Admin access button on home */}
      {showAdminButton && !isAdminMode && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentView('admin')}
          className="fixed bottom-20 right-4 z-40 bg-white/90 dark:bg-card/90 backdrop-blur-sm border-green-200 dark:border-green-800 shadow-lg hover:bg-green-50 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 gap-1.5 opacity-50 hover:opacity-100 transition-opacity"
        >
          <ShoppingBag className="size-3.5" />
          <span className="text-xs">Admin</span>
        </Button>
      )}

      {/* Admin mode exit button */}
      {isAdminMode && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsAdminMode(false)
            setCurrentView('home')
          }}
          className="fixed bottom-4 right-4 z-50 bg-white/90 dark:bg-card/90 backdrop-blur-sm border-red-200 dark:border-red-800 shadow-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 gap-1.5 transition-opacity"
        >
          <ArrowLeft className="size-3.5" />
          <span className="text-xs">Exit Admin</span>
        </Button>
      )}
    </div>
  )
}
