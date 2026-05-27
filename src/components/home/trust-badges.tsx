'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Clock, Leaf, Shield, Headphones } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useStore } from '@/store/use-store'

// Animated Counter Component
function TrustCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
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
    const steps = 50
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
  }, [hasStarted, target, duration])

  return <div ref={ref}>{count.toLocaleString()}</div>
}

const BADGES = [
  {
    icon: Clock,
    titleBn: '১ ঘণ্টায় ডেলিভারি',
    titleEn: '1 Hour Delivery',
    descBn: 'মোহাম্মদপুর এলাকায় দ্রুত ডেলিভারি',
    descEn: 'Fast delivery in Mohammadpur area',
    gradient: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20',
    iconBg: 'bg-orange-100 dark:bg-orange-900/50',
    iconColor: 'text-orange-600 dark:text-orange-400',
    counter: 1,
    counterLabelBn: 'ঘণ্টা',
    counterLabelEn: 'Hour',
    glowClass: 'animate-glow-orange',
  },
  {
    icon: Leaf,
    titleBn: 'তাজা পণ্য গ্যারান্টি',
    titleEn: 'Fresh Product Guarantee',
    descBn: '১০০% তাজা বা টাকা ফেরত',
    descEn: '100% fresh or money back',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20',
    iconBg: 'bg-green-100 dark:bg-green-900/50',
    iconColor: 'text-green-600 dark:text-green-400',
    counter: 100,
    counterLabelBn: '% তাজা',
    counterLabelEn: '% Fresh',
    glowClass: 'animate-glow',
  },
  {
    icon: Shield,
    titleBn: 'নিরাপদ পেমেন্ট',
    titleEn: 'Secure Payment',
    descBn: 'bKash, Nagad, COD সাপোর্ট',
    descEn: 'bKash, Nagad, COD support',
    gradient: 'from-teal-500 to-cyan-500',
    bgGradient: 'from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/20',
    iconBg: 'bg-teal-100 dark:bg-teal-900/50',
    iconColor: 'text-teal-600 dark:text-teal-400',
    counter: 3,
    counterLabelBn: 'পেমেন্ট',
    counterLabelEn: 'Payments',
    glowClass: '',
  },
  {
    icon: Headphones,
    titleBn: '২৪/৭ সাপোর্ট',
    titleEn: '24/7 Support',
    descBn: 'WhatsApp ও ফোনে সাপোর্ট',
    descEn: 'WhatsApp & phone support',
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    counter: 24,
    counterLabelBn: 'ঘণ্টা',
    counterLabelEn: 'Hours',
    glowClass: '',
  },
]

export function TrustBadges() {
  const { language } = useStore()

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {language === 'bn' ? 'কেন আমাদের বিশ্বাস করবেন?' : 'Why Trust Us?'}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {language === 'bn'
              ? 'আমরা আপনার সন্তুষ্টি নিশ্চিত করি'
              : 'We ensure your satisfaction'}
          </p>
        </motion.div>

        {/* Trust Badges Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {BADGES.map((badge, index) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: index * 0.12, type: 'spring', stiffness: 150, damping: 20 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className={`border-0 shadow-sm hover:shadow-lg transition-all duration-300 h-full ${badge.glowClass}`}>
                  <CardContent className="p-5 md:p-6">
                    <div className={`bg-gradient-to-br ${badge.bgGradient} rounded-xl p-4 md:p-5 text-center h-full flex flex-col items-center justify-center`}>
                      {/* Floating Icon */}
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${badge.iconBg} flex items-center justify-center mb-3`}
                      >
                        <Icon className={`size-6 md:size-7 ${badge.iconColor}`} />
                      </motion.div>

                      {/* Animated Counter */}
                      <div className="text-2xl md:text-3xl font-extrabold text-foreground mb-0.5 flex items-baseline gap-0.5">
                        <TrustCounter target={badge.counter} />
                        <span className="text-sm md:text-base font-semibold text-muted-foreground">
                          {language === 'bn' ? badge.counterLabelBn : badge.counterLabelEn}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm md:text-base text-foreground mb-1.5">
                        {language === 'bn' ? badge.titleBn : badge.titleEn}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                        {language === 'bn' ? badge.descBn : badge.descEn}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
