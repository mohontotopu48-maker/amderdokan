'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, Percent, Gift, Truck, Clock, Banknote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/use-store'

export function HeroSection() {
  const { language, setCurrentView } = useStore()

  return (
    <section className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-banner.png')" }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30 dark:from-black/85 dark:via-black/70 dark:to-black/50" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 lg:py-28 flex flex-col justify-center min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
        <div className="max-w-2xl">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-4"
          >
            {language === 'bn' ? 'তাজা বাজার, আপনার দোরগোড়ায়' : 'Fresh Market, At Your Doorstep'}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 max-w-xl"
          >
            {language === 'bn'
              ? 'মোহাম্মদপুরের সেরা অনলাইন গ্রোসারি শপ - ১ ঘণ্টায় ডেলিভারি'
              : "Mohammadpur's Best Online Grocery Shop - 1 Hour Delivery"}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
            className="flex flex-wrap gap-3 mb-8"
          >
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold text-base px-6 py-3 shadow-lg shadow-green-600/30"
              onClick={() => setCurrentView('products')}
            >
              <ShoppingCart className="mr-2 size-5" />
              {language === 'bn' ? 'এখনই অর্ডার করুন' : 'Order Now'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white font-semibold text-base px-6 py-3 bg-transparent"
              onClick={() => setCurrentView('products')}
            >
              <Percent className="mr-2 size-5" />
              {language === 'bn' ? 'অফার দেখুন' : 'See Offers'}
            </Button>
          </motion.div>

          {/* Delivery Promise Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-wrap gap-2 md:gap-3"
          >
            <Badge className="bg-white/15 backdrop-blur-sm text-white border-white/20 px-3 py-1.5 text-sm hover:bg-white/25">
              <Clock className="mr-1.5 size-3.5" />
              {language === 'bn' ? '১ ঘণ্টায় ডেলিভারি' : '1 Hour Delivery'}
            </Badge>
            <Badge className="bg-white/15 backdrop-blur-sm text-white border-white/20 px-3 py-1.5 text-sm hover:bg-white/25">
              <Truck className="mr-1.5 size-3.5" />
              {language === 'bn' ? '৫০০৳+ ফ্রি ডেলিভারি' : '500৳+ Free Delivery'}
            </Badge>
            <Badge className="bg-white/15 backdrop-blur-sm text-white border-white/20 px-3 py-1.5 text-sm hover:bg-white/25">
              <Banknote className="mr-1.5 size-3.5" />
              {language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
            </Badge>
          </motion.div>
        </div>

        {/* Promotional Offer Cards Overlay */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
          className="hidden md:flex flex-col gap-3 absolute right-4 lg:right-12 top-1/2 -translate-y-1/2"
        >
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl px-5 py-4 shadow-xl shadow-orange-500/30 min-w-[160px]">
            <div className="text-3xl font-extrabold">৫০%</div>
            <div className="text-sm font-medium opacity-90">{language === 'bn' ? 'ছাড়' : 'OFF'}</div>
            <div className="text-xs mt-1 opacity-80">{language === 'bn' ? 'প্রথম অর্ডারে' : 'On First Order'}</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl px-5 py-4 shadow-xl shadow-green-600/30 min-w-[160px]">
            <Gift className="size-5 mb-1" />
            <div className="text-sm font-bold">{language === 'bn' ? 'বিশেষ অফার' : 'Special Offer'}</div>
            <div className="text-xs mt-1 opacity-80">{language === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Delivery'}</div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full h-8 md:h-12" preserveAspectRatio="none">
          <path
            d="M0,60 L0,30 Q360,0 720,30 Q1080,60 1440,30 L1440,60 Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  )
}
