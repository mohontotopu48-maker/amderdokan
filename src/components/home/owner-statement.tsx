'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { useStore } from '@/store/use-store'

export function OwnerStatement() {
  const { language } = useStore()

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-2xl"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800" />

          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="owner-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#owner-pattern)" />
            </svg>
          </div>

          {/* Large Decorative Quote */}
          <div className="absolute top-4 left-4 md:top-8 md:left-8 opacity-10">
            <Quote className="size-24 md:size-36 text-white" />
          </div>
          <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 opacity-10 rotate-180">
            <Quote className="size-24 md:size-36 text-white" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 py-12 md:px-16 md:py-20 lg:px-24 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Small Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                  <Quote className="size-6 text-white" />
                </div>
              </div>

              {/* Quote Text */}
              <blockquote className="text-lg md:text-2xl lg:text-3xl font-medium text-white leading-relaxed max-w-3xl mx-auto mb-8">
                {language === 'bn'
                  ? 'আমাদের বাজার শুধু একটি দোকান নয়, এটি আমাদের এলাকার মানুষের জন্য নির্ভরতার একটি নাম।'
                  : 'Amar Bazar is not just a shop, it is a name of trust for the people of our area.'}
              </blockquote>

              {/* Attribution */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-0.5 bg-white/40" />
                <div>
                  <p className="text-white font-bold text-base md:text-lg">
                    {language === 'bn' ? '— নিবির হোসেন' : '— Nibir Hossain'}
                  </p>
                  <p className="text-white/70 text-sm mt-0.5">
                    {language === 'bn' ? 'প্রতিষ্ঠাতা, আমাদের বাজার' : 'Founder, Amar Bazar'}
                  </p>
                </div>
                <div className="w-12 h-0.5 bg-white/40" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
