'use client'

import { useStore } from '@/store/use-store'

const SERVICES_BN = [
  '🚚 ১ ঘণ্টায় ডেলিভারি',
  '💳 bKash পেমেন্ট',
  '💰 নগদ ক্যাশ আউট',
  '⚡ DPDC বিদ্যুৎ বিল',
  '🎁 WELCOME10 কুপন',
  '🏪 ১৫৬+ পণ্য',
  '⭐ ৪.৮ রেটিং',
  '🔒 নিরাপদ পেমেন্ট',
]

const SERVICES_EN = [
  '🚚 1 Hour Delivery',
  '💳 bKash Payment',
  '💰 Cash Out',
  '⚡ DPDC Electric Bill',
  '🎁 WELCOME10 Coupon',
  '🏪 156+ Products',
  '⭐ 4.8 Rating',
  '🔒 Secure Payment',
]

export function ServicesMarquee() {
  const { language } = useStore()
  const services = language === 'bn' ? SERVICES_BN : SERVICES_EN

  // Duplicate the services for seamless infinite scroll
  const doubled = [...services, ...services]

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-500 to-orange-500 animate-gradient py-3">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-green-600 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-orange-500 to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((service, i) => (
          <span
            key={i}
            className="mx-6 md:mx-8 text-sm md:text-base font-semibold text-white inline-flex items-center gap-1"
          >
            {service}
            <span className="ml-6 md:ml-8 text-white/40">•</span>
          </span>
        ))}
      </div>
    </section>
  )
}
