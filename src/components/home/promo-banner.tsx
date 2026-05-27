'use client'

import { motion } from 'framer-motion'
import { Tag, ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/use-store'

export function PromoBanner() {
  const { language, setCurrentView } = useStore()

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl min-h-[220px] md:min-h-[300px]"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/promo-banner-new.png')" }}
          />

          {/* User's pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "url('/bg-pattern.png')",
              backgroundRepeat: 'repeat',
              backgroundSize: '180px 180px',
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/80 to-green-700/50 dark:from-green-950/95 dark:via-green-900/85 dark:to-green-800/60" />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center h-full min-h-[220px] md:min-h-[300px] px-6 md:px-12 py-8">
            {/* Offer Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-sm font-semibold mb-3 w-fit">
                <Tag className="mr-1.5 size-3.5" />
                {language === 'bn' ? 'আজকের বিশেষ অফার' : "Today's Special Offer"}
              </Badge>
            </motion.div>

            {/* Main Text */}
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-2"
            >
              {language === 'bn' ? '৫০% পর্যন্ত ছাড়!' : 'Up to 50% OFF!'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-white/90 text-sm md:text-base mb-3 max-w-md"
            >
              {language === 'bn'
                ? 'ফলমূল, সবজি ও মসলায় বিশেষ ছাড়। সীমিত সময়ের অফার, এখনই অর্ডার করুন!'
                : 'Special discounts on fruits, vegetables & spices. Limited time offer, order now!'}
            </motion.p>

            {/* Flash Sale Countdown (Daraz competitor pattern) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex items-center gap-2 mb-5"
            >
              <Clock className="size-4 text-orange-400" />
              <span className="text-orange-300 text-sm font-semibold">
                {language === 'bn' ? 'অফার শেষ হতে আর' : 'Offer ends in'}:
              </span>
              <div className="flex gap-1">
                {['05', '23', '47'].map((val, i) => (
                  <span key={i} className="bg-white/20 backdrop-blur-sm rounded px-2 py-0.5 text-white font-mono font-bold text-sm animate-countdown-pulse">
                    {val}{i < 2 && <span className="text-orange-300 ml-1">:</span>}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30"
                onClick={() => setCurrentView('products')}
              >
                {language === 'bn' ? 'অফার দেখুন' : 'View Offers'}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </motion.div>

            {/* Decorative Circles */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:block">
              <div className="w-32 h-32 rounded-full border-4 border-white/10" />
              <div className="absolute inset-4 rounded-full border-4 border-white/10" />
              <div className="absolute inset-8 rounded-full border-4 border-white/10" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
