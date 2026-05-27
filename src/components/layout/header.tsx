'use client'

import React, { useState, useEffect, useSyncExternalStore, useRef } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Sun,
  Moon,
  ShoppingCart,
  Menu,
  Phone,
  MessageCircle,
  X,
  Home,
  ShoppingBag,
  Tag,
  Info,
  ChevronRight,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useStore } from '@/store/use-store'

const navLinks = [
  { key: 'home', labelBn: 'হোম', labelEn: 'Home', icon: Home },
  { key: 'products', labelBn: 'পণ্য', labelEn: 'Products', icon: ShoppingBag },
  { key: 'offers', labelBn: 'অফার', labelEn: 'Offers', icon: Tag },
  { key: 'about', labelBn: 'আমাদের সম্পর্কে', labelEn: 'About', icon: Info },
] as const

export function Header() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)

  const {
    language,
    setLanguage,
    isCartOpen,
    setIsCartOpen,
    isSearchOpen,
    setIsSearchOpen,
    setCurrentView,
    getCartItemCount,
  } = useStore()

  const isBn = language === 'bn'
  const cartItemCount = getCartItemCount()

  // Scroll-based hide/show header (like YouTube mobile)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 10)

      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > 200) {
        setHeaderVisible(currentScrollY < lastScrollY.current)
      } else {
        setHeaderVisible(true)
      }
      lastScrollY.current = currentScrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (key: string) => {
    if (key === 'offers') {
      setCurrentView('products')
    } else if (key === 'home') {
      setCurrentView('home')
    } else if (key === 'products') {
      setCurrentView('products')
    } else if (key === 'about') {
      setCurrentView('about')
    }
    setMobileMenuOpen(false)
  }

  return (
    <motion.header
      className="sticky top-0 z-50 w-full"
      animate={{ y: headerVisible ? 0 : -120 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Delivery Promise Bar */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 dark:from-green-800 dark:via-green-700 dark:to-emerald-800 text-white">
        <div className="overflow-hidden">
          <div className="flex animate-slide-text whitespace-nowrap py-1.5 text-xs sm:text-sm font-medium">
            <span className="mx-8">
              🚚 {isBn ? '৫০০ টাকার উপরে ফ্রি ডেলিভারি' : 'Free Delivery on ৳500+'}
            </span>
            <span className="mx-8">
              ⚡ {isBn ? 'মোহাম্মদপুর এলাকায় ১ ঘণ্টায় ডেলিভারি' : '1-Hour Delivery in Mohammadpur'}
            </span>
            <span className="mx-8">
              🎁 {isBn ? 'প্রথম অর্ডারে ১০% ছাড়' : '10% Off on First Order'}
            </span>
            <span className="mx-8">
              📞 {isBn ? 'অর্ডার করুন: ০১৭০০-০০০০০০' : 'Order Now: 01700-000000'}
            </span>
            <span className="mx-8">
              🚚 {isBn ? '৫০০ টাকার উপরে ফ্রি ডেলিভারি' : 'Free Delivery on ৳500+'}
            </span>
            <span className="mx-8">
              ⚡ {isBn ? 'মোহাম্মদপুর এলাকায় ১ ঘণ্টায় ডেলিভারি' : '1-Hour Delivery in Mohammadpur'}
            </span>
            <span className="mx-8">
              🎁 {isBn ? 'প্রথম অর্ডারে ১০% ছাড়' : '10% Off on First Order'}
            </span>
            <span className="mx-8">
              📞 {isBn ? 'অর্ডার করুন: ০১৭০০-০০০০০০' : 'Order Now: 01700-000000'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div
        className={`bg-white/95 dark:bg-[#0f1210]/95 backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? 'shadow-lg border-b border-border/50'
            : 'shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled ? 'py-2' : 'py-3 sm:py-4'
            }`}
          >
            {/* Logo */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 shrink-0 group"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-green-50 dark:bg-green-900/30 border-2 border-green-500/20 group-hover:border-green-500/50 transition-colors"
              >
                <Image
                  src="/logo-bazar.png"
                  alt="আমাদের বাজার"
                  fill
                  className="object-contain p-0.5"
                  priority
                />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-green-700 dark:text-green-400 leading-tight">
                  আমাদের বাজার
                </h1>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {isBn ? 'ভরসার বাজার' : 'Trusted Market'}
                </p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <motion.button
                    key={link.key}
                    onClick={() => handleNavClick(link.key)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-green-700 dark:hover:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                    {isBn ? link.labelBn : link.labelEn}
                  </motion.button>
                )
              })}
            </nav>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <div className="relative w-full group">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                </motion.div>
                <Input
                  placeholder={isBn ? 'পণ্য খুঁজুন...' : 'Search products...'}
                  className="pl-9 pr-4 h-9 bg-muted/50 border-green-200/50 dark:border-green-800/30 focus-visible:border-green-500 focus-visible:ring-green-500/20 transition-all duration-200 focus-visible:shadow-md focus-visible:shadow-green-500/10"
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => useStore.getState().setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile Search - Pulse Animation */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-foreground/70 hover:text-green-700 dark:hover:text-green-400"
                onClick={() => setIsSearchOpen(true)}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Search className="w-5 h-5" />
                </motion.div>
              </Button>

              {/* Language Toggle - Smooth Transition */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground/70 hover:text-green-700 dark:hover:text-green-400"
                  >
                    <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                      <Globe className="w-4 h-4" />
                    </motion.div>
                    <span className="sr-only">Toggle language</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setLanguage('bn')}
                    className={language === 'bn' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : ''}
                  >
                    🇧🇩 বাংলা
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLanguage('en')}
                    className={language === 'en' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : ''}
                  >
                    🇬🇧 English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle - Smooth Icon Transition */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="text-foreground/70 hover:text-green-700 dark:hover:text-green-400"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={theme}
                      initial={{ rotate: -90, scale: 0, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: 90, scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme === 'dark' ? (
                        <Sun className="w-5 h-5" />
                      ) : (
                        <Moon className="w-5 h-5" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <span className="sr-only">
                    {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  </span>
                </Button>
              )}

              {/* Cart Button - Bounce Animation */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-foreground/70 hover:text-green-700 dark:hover:text-green-400"
                onClick={() => setIsCartOpen(true)}
              >
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={cartItemCount}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </motion.div>
                </AnimatePresence>
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.3, 1] }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    >
                      <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center bg-accent text-white text-[10px] font-bold border-0">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="sr-only">
                  {isBn ? `কার্ট (${cartItemCount} আইটেম)` : `Cart (${cartItemCount} items)`}
                </span>
              </Button>

              {/* WhatsApp Quick Order */}
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex"
              >
                <Button
                  size="sm"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white animate-pulse-glow gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden lg:inline text-xs">
                    {isBn ? 'কুইক অর্ডার' : 'Quick Order'}
                  </span>
                </Button>
              </a>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-foreground/70 hover:text-green-700 dark:hover:text-green-400"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
                <span className="sr-only">
                  {isBn ? 'মেনু খুলুন' : 'Open menu'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
          <SheetHeader className="p-4 pb-2 bg-gradient-to-br from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800 text-white">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/20 border-2 border-white/30">
                <Image
                  src="/logo-bazar.png"
                  alt="আমাদের বাজার"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <SheetTitle className="text-white text-lg font-bold">
                  আমাদের বাজার
                </SheetTitle>
                <p className="text-white/70 text-xs">
                  {isBn ? 'ভরসার বাজার' : 'Trusted Market'}
                </p>
              </div>
            </div>
          </SheetHeader>

          <div className="flex flex-col h-[calc(100%-120px)]">
            {/* Navigation Links */}
            <nav className="flex-1 py-2">
              {navLinks.map((link, i) => {
                const Icon = link.icon
                return (
                  <motion.button
                    key={link.key}
                    onClick={() => handleNavClick(link.key)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-foreground/80 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    {isBn ? link.labelBn : link.labelEn}
                    <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                  </motion.button>
                )
              })}
            </nav>

            {/* Quick Contact */}
            <div className="p-4 border-t border-border space-y-2">
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full"
              >
                <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {isBn ? 'WhatsApp অর্ডার' : 'WhatsApp Order'}
                </Button>
              </a>
              <a href="tel:+8801700000000" className="flex items-center gap-2 w-full">
                <Button variant="outline" className="w-full gap-2 border-green-200 dark:border-green-800">
                  <Phone className="w-4 h-4" />
                  {isBn ? 'কল করুন' : 'Call Us'}
                </Button>
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-background p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                    <Input
                      autoFocus
                      placeholder={isBn ? 'পণ্য খুঁজুন... (যেমন: আলু, পেঁয়াজ, চাল)' : 'Search products... (e.g., potato, onion, rice)'}
                      className="pl-10 pr-4 h-12 text-base border-green-200 dark:border-green-800 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                      onChange={(e) => useStore.getState().setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setIsSearchOpen(false)
                          setCurrentView('products')
                        }
                      }}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(false)}
                    className="shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['আলু', 'পেঁয়াজ', 'চাল', 'মাছ', 'দুধ', 'মসলা'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        useStore.getState().setSearchQuery(term)
                        setIsSearchOpen(false)
                        setCurrentView('products')
                      }}
                      className="px-3 py-1 text-xs rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
