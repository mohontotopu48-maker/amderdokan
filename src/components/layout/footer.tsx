'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Shield,
  Truck,
  Clock,
  Award,
  CreditCard,
  Banknote,
  Smartphone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useStore } from '@/store/use-store'

const quickLinks = {
  categories: [
    { labelBn: 'শাকসবজি', labelEn: 'Vegetables', slug: 'vegetables' },
    { labelBn: 'ফলমূল', labelEn: 'Fruits', slug: 'fruits' },
    { labelBn: 'মাছ ও মাংস', labelEn: 'Fish & Meat', slug: 'fish-meat' },
    { labelBn: 'চাল ও ডাল', labelEn: 'Rice & Lentils', slug: 'rice-lentils' },
    { labelBn: 'মসলা ও তেল', labelEn: 'Spices & Oil', slug: 'spices-oil' },
    { labelBn: 'দুগ্ধ ও ডিম', labelEn: 'Dairy & Eggs', slug: 'dairy-eggs' },
  ],
  info: [
    { labelBn: 'আমাদের সম্পর্কে', labelEn: 'About Us', view: 'about' as const },
    { labelBn: 'ডেলিভারি নীতি', labelEn: 'Delivery Policy', view: 'about' as const },
    { labelBn: 'রিটার্ন নীতি', labelEn: 'Return Policy', view: 'about' as const },
    { labelBn: 'গোপনীয়তা নীতি', labelEn: 'Privacy Policy', view: 'about' as const },
  ],
}

const footerSectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const },
  }),
}

export function Footer() {
  const { language, setCurrentView } = useStore()
  const isBn = language === 'bn'

  return (
    <footer className="bg-gradient-to-b from-green-900 to-green-950 dark:from-[#0a110d] dark:to-[#060d08] text-green-50">
      {/* Trust Badges */}
      <div className="border-b border-green-800/50 dark:border-green-900/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                icon: Truck,
                labelBn: 'ফ্রি ডেলিভারি',
                labelEn: 'Free Delivery',
                subBn: '৫০০ টাকার উপরে',
                subEn: 'On ৳500+',
              },
              {
                icon: Clock,
                labelBn: 'দ্রুত ডেলিভারি',
                labelEn: 'Fast Delivery',
                subBn: '১ ঘণ্টায় মোহাম্মদপুর',
                subEn: '1hr in Mohammadpur',
              },
              {
                icon: Shield,
                labelBn: '১০০% তাজা',
                labelEn: '100% Fresh',
                subBn: 'মাননিয় পণ্য',
                subEn: 'Quality Products',
              },
              {
                icon: Award,
                labelBn: 'সেরা দাম',
                labelEn: 'Best Price',
                subBn: 'বাজারের চেয়ে কম',
                subEn: 'Below Market Rate',
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg bg-green-800/30 dark:bg-green-900/20"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-700/40 dark:bg-green-800/30 flex items-center justify-center"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                  </motion.div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-green-100 truncate">
                      {isBn ? item.labelBn : item.labelEn}
                    </p>
                    <p className="text-[10px] sm:text-xs text-green-300/70 truncate">
                      {isBn ? item.subBn : item.subEn}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Animated Gradient Separator */}
      <div className="h-[2px] animate-gradient-line" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            variants={footerSectionVariants}
            className="sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/10 border-2 border-green-400/30">
                <Image
                  src="/logo-bazar.png"
                  alt="আমাদের বাজার"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-green-100">আমাদের বাজার</h2>
                <p className="text-xs text-green-300/70">
                  {isBn ? 'নির্ভরতার একটি নাম' : 'A Name of Trust'}
                </p>
              </div>
            </div>
            <div className="space-y-2.5 text-sm text-green-200/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-green-400" />
                <p>
                  Mohammadpur Housing, Limited Art,
                  <br />
                  House Number 123, Dhaka 1207
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-green-400" />
                <a href="tel:+8801700000000" className="hover:text-green-300 transition-colors">
                  +880 1700-000000
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 shrink-0 text-green-400" />
                <a
                  href="https://wa.me/8801700000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-300 transition-colors"
                >
                  WhatsApp: +880 1700-000000
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-green-400" />
                <a href="mailto:info@amarbazar.com.bd" className="hover:text-green-300 transition-colors">
                  info@amarbazar.com.bd
                </a>
              </div>
            </div>
            <p className="mt-3 text-xs text-green-300/60">
              {isBn ? 'মালিক:' : 'Owner:'} Nibir Hossain
            </p>
          </motion.div>

          {/* Categories */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            variants={footerSectionVariants}
          >
            <h3 className="text-sm font-semibold text-green-100 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-accent rounded-full" />
              {isBn ? 'ক্যাটাগরি' : 'Categories'}
            </h3>
            <ul className="space-y-2">
              {quickLinks.categories.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => setCurrentView('products')}
                    className="text-sm text-green-200/70 hover:text-green-300 transition-colors"
                  >
                    {isBn ? cat.labelBn : cat.labelEn}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Info Links */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            variants={footerSectionVariants}
          >
            <h3 className="text-sm font-semibold text-green-100 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-accent rounded-full" />
              {isBn ? 'তথ্য' : 'Information'}
            </h3>
            <ul className="space-y-2">
              {quickLinks.info.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => setCurrentView(item.view)}
                    className="text-sm text-green-200/70 hover:text-green-300 transition-colors"
                  >
                    {isBn ? item.labelBn : item.labelEn}
                  </button>
                </li>
              ))}
            </ul>

            {/* Social Media - Animated Icons */}
            <div className="mt-5">
              <h4 className="text-sm font-semibold text-green-100 mb-2">
                {isBn ? 'ফলো করুন' : 'Follow Us'}
              </h4>
              <div className="flex gap-2">
                {[
                  { icon: Facebook, href: 'https://facebook.com/amarbazar', label: 'Facebook', hoverColor: 'hover:bg-blue-600', hoverText: 'hover:text-white' },
                  { icon: Instagram, href: 'https://instagram.com/amarbazar', label: 'Instagram', hoverColor: 'hover:bg-pink-600', hoverText: 'hover:text-white' },
                  { icon: Youtube, href: 'https://youtube.com/@amarbazar', label: 'YouTube', hoverColor: 'hover:bg-red-600', hoverText: 'hover:text-white' },
                ].map((social) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-8 h-8 rounded-full bg-green-800/40 dark:bg-green-900/30 flex items-center justify-center transition-colors duration-200 ${social.hoverColor} ${social.hoverText}`}
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4 text-green-300" />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            variants={footerSectionVariants}
          >
            <h3 className="text-sm font-semibold text-green-100 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-accent rounded-full" />
              {isBn ? 'পেমেন্ট পদ্ধতি' : 'Payment Methods'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Smartphone, label: 'bKash', color: 'text-pink-400' },
                { icon: Smartphone, label: 'Nagad', color: 'text-orange-400' },
                { icon: Smartphone, label: 'Rocket', color: 'text-purple-400' },
                { icon: Banknote, label: isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery', color: 'text-green-400' },
              ].map((method) => {
                const Icon = method.icon
                return (
                  <div
                    key={method.label}
                    className="flex items-center gap-2 p-2 rounded-lg bg-green-800/30 dark:bg-green-900/20"
                  >
                    <Icon className={`w-4 h-4 ${method.color}`} />
                    <span className="text-xs text-green-200/80 truncate">{method.label}</span>
                  </div>
                )
              })}
            </div>

            {/* Quick Order CTA */}
            <div className="mt-5">
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2 text-sm">
                  <MessageCircle className="w-4 h-4" />
                  {isBn ? 'WhatsApp এ অর্ডার করুন' : 'Order via WhatsApp'}
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-800/50 dark:border-green-900/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-green-300/60 text-center sm:text-left">
              © {new Date().getFullYear()} আমাদের বাজার (Amar Bazar).{' '}
              {isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
            </p>
            <p className="text-xs text-green-400/80 font-medium">
              {isBn ? 'নির্ভরতার একটি নাম ✦' : 'A Name of Trust ✦'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
