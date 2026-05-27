'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ShoppingCart, Percent, Gift, Truck, Clock, Banknote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/use-store'

// Animated counter component
function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    const duration = 2000
    const steps = 60
    const stepTime = duration / steps
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepTime)
    return () => clearInterval(timer)
  }, [hasStarted, target])

  return (
    <div ref={ref} className="font-extrabold">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  )
}

// Typing effect text
function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1))
          index++
        } else {
          clearInterval(interval)
          setTimeout(() => setShowCursor(false), 2000)
        }
      }, 60)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay])

  return (
    <span>
      {displayedText}
      {showCursor && <span className="animate-blink-cursor ml-0.5">&nbsp;</span>}
    </span>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
}

const badgeFloatVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.8 + i * 0.1,
      ease: 'easeOut' as const,
    },
  }),
}

const counterData = [
  { icon: Clock, labelBn: 'ঘণ্টায় ডেলিভারি', labelEn: 'Hour Delivery', value: 1, prefix: '', suffix: '' },
  { icon: ShoppingCart, labelBn: '+ পণ্য', labelEn: '+ Products', value: 5000, prefix: '', suffix: '+' },
  { icon: Banknote, labelBn: '+ গ্রাহক', labelEn: '+ Customers', value: 100000, prefix: '', suffix: '+' },
]

export function HeroSection() {
  const { language, setCurrentView } = useStore()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section ref={sectionRef} className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-banner.png')",
          y: imageY,
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30 dark:from-black/85 dark:via-black/70 dark:to-black/50" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-4 py-12 md:py-20 lg:py-28 flex flex-col justify-center min-h-[500px] md:min-h-[600px] lg:min-h-[700px]"
      >
        <div className="max-w-2xl">
          {/* Main Headline with Gradient Text + Typing Effect */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-4"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-300 to-orange-400 animate-gradient inline-block">
              {language === 'bn' ? (
                <TypingText text="তাজা বাজার, আপনার দোরগোড়ায়" delay={500} />
              ) : (
                <TypingText text="Fresh Market, At Your Doorstep" delay={500} />
              )}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 max-w-xl"
          >
            {language === 'bn'
              ? 'মোহাম্মদপুরের সেরা অনলাইন গ্রোসারি শপ - ১ ঘণ্টায় ডেলিভারি'
              : "Mohammadpur's Best Online Grocery Shop - 1 Hour Delivery"}
          </motion.p>

          {/* Animated Counters */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 md:gap-6 mb-8"
          >
            {counterData.map((counter, i) => {
              const Icon = counter.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.15, type: 'spring', stiffness: 200 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10"
                >
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Icon className="size-4 text-green-400" />
                  </div>
                  <div className="text-white">
                    <div className="text-lg md:text-xl font-extrabold leading-none">
                      <AnimatedCounter
                        target={counter.value}
                        suffix={i === 0 ? '' : counter.suffix}
                        prefix={i === 0 ? '' : ''}
                      />
                    </div>
                    <div className="text-[10px] md:text-xs text-white/70 mt-0.5">
                      {i === 0 ? (language === 'bn' ? '১ ঘণ্টায় ডেলিভারি' : '1 Hour Delivery') :
                       i === 1 ? (language === 'bn' ? '৫০০০+ পণ্য' : '5000+ Products') :
                       (language === 'bn' ? '১ লাখ+ গ্রাহক' : '1 Lakh+ Customers')}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* CTA Buttons with Pulse */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-3 mb-8"
          >
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold text-base px-6 py-3 shadow-lg shadow-green-600/30 animate-cta-pulse"
              onClick={() => setCurrentView('products')}
            >
              <ShoppingCart className="mr-2 size-5" />
              {language === 'bn' ? 'এখনই অর্ডার করুন' : 'Order Now'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white font-semibold text-base px-6 py-3 bg-transparent animate-cta-pulse-orange"
              onClick={() => setCurrentView('products')}
            >
              <Percent className="mr-2 size-5" />
              {language === 'bn' ? 'অফার দেখুন' : 'See Offers'}
            </Button>
          </motion.div>

          {/* Delivery Promise Badges with Floating Animation */}
          <motion.div
            className="flex flex-wrap gap-2 md:gap-3"
          >
            {[
              { icon: Clock, textBn: '১ ঘণ্টায় ডেলিভারি', textEn: '1 Hour Delivery' },
              { icon: Truck, textBn: '৫০০৳+ ফ্রি ডেলিভারি', textEn: '500৳+ Free Delivery' },
              { icon: Banknote, textBn: 'ক্যাশ অন ডেলিভারি', textEn: 'Cash on Delivery' },
            ].map((badge, i) => {
              const Icon = badge.icon
              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={badgeFloatVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.08, y: -2 }}
                  className={`animate-float`}
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  <Badge className="bg-white/15 backdrop-blur-sm text-white border-white/20 px-3 py-1.5 text-sm hover:bg-white/25">
                    <Icon className="mr-1.5 size-3.5" />
                    {language === 'bn' ? badge.textBn : badge.textEn}
                  </Badge>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Promotional Offer Cards Overlay with Enhanced Animation */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="hidden md:flex flex-col gap-3 absolute right-4 lg:right-12 top-1/2 -translate-y-1/2"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: -1 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl px-5 py-4 shadow-xl shadow-orange-500/30 min-w-[160px] animate-glow-orange"
          >
            <div className="text-3xl font-extrabold">৫০%</div>
            <div className="text-sm font-medium opacity-90">{language === 'bn' ? 'ছাড়' : 'OFF'}</div>
            <div className="text-xs mt-1 opacity-80">{language === 'bn' ? 'প্রথম অর্ডারে' : 'On First Order'}</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl px-5 py-4 shadow-xl shadow-green-600/30 min-w-[160px] animate-glow"
          >
            <Gift className="size-5 mb-1" />
            <div className="text-sm font-bold">{language === 'bn' ? 'বিশেষ অফার' : 'Special Offer'}</div>
            <div className="text-xs mt-1 opacity-80">{language === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Delivery'}</div>
          </motion.div>
        </motion.div>
      </motion.div>

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
