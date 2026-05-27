'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/use-store'
import { ArrowRight, Wallet } from 'lucide-react'

const SERVICES = [
  {
    type: 'bkash_cashout',
    nameBn: 'বিকাশ ক্যাশ আউট',
    nameEn: 'bKash Cash Out',
    emoji: '💗',
    gradient: 'from-pink-500 via-rose-500 to-pink-600',
    bgGradient: 'from-pink-50 via-rose-50 to-pink-100 dark:from-pink-950/40 dark:via-rose-950/30 dark:to-pink-900/20',
    borderHover: 'hover:border-pink-300 dark:hover:border-pink-700',
    shadowHover: 'hover:shadow-pink-200/50 dark:hover:shadow-pink-900/30',
    badgeBg: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
    btnBg: 'bg-pink-600 hover:bg-pink-700 text-white',
    descriptionBn: 'বিকাশ থেকে ক্যাশ আউট করুন সহজে',
    descriptionEn: 'Cash out from bKash easily',
    feeBn: '১.৮৫% ফি',
    feeEn: '1.85% fee',
  },
  {
    type: 'nagad_cashout',
    nameBn: 'নগদ ক্যাশ আউট',
    nameEn: 'Nagad Cash Out',
    emoji: '🟠',
    gradient: 'from-orange-500 via-amber-500 to-orange-600',
    bgGradient: 'from-orange-50 via-amber-50 to-orange-100 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-orange-900/20',
    borderHover: 'hover:border-orange-300 dark:hover:border-orange-700',
    shadowHover: 'hover:shadow-orange-200/50 dark:hover:shadow-orange-900/30',
    badgeBg: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    btnBg: 'bg-orange-600 hover:bg-orange-700 text-white',
    descriptionBn: 'নগদ থেকে ক্যাশ আউট করুন সহজে',
    descriptionEn: 'Cash out from Nagad easily',
    feeBn: '১.৪৫% ফি',
    feeEn: '1.45% fee',
  },
  {
    type: 'dpdc_electric',
    nameBn: 'DPDC বিদ্যুৎ বিল',
    nameEn: 'DPDC Electric Bill',
    emoji: '⚡',
    gradient: 'from-sky-500 via-blue-500 to-indigo-600',
    bgGradient: 'from-sky-50 via-blue-50 to-indigo-100 dark:from-sky-950/40 dark:via-blue-950/30 dark:to-indigo-900/20',
    borderHover: 'hover:border-sky-300 dark:hover:border-sky-700',
    shadowHover: 'hover:shadow-sky-200/50 dark:hover:shadow-sky-900/30',
    badgeBg: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    btnBg: 'bg-sky-600 hover:bg-sky-700 text-white',
    descriptionBn: 'DPDC বিদ্যুৎ বিল পরিশোধ করুন',
    descriptionEn: 'Pay your DPDC electric bill',
    feeBn: 'কোনো ফি নেই',
    feeEn: 'No fee',
  },
]

export function BillPaymentSection() {
  const { language, setIsBillPaymentOpen, setBillPaymentType } = useStore()
  const isBn = language === 'bn'

  const handlePayNow = (type: string) => {
    setBillPaymentType(type)
    setIsBillPaymentOpen(true)
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40">
              <Wallet className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {isBn ? 'সেবা সমূহ' : 'Our Services'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isBn ? 'বিল পেমেন্ট ও ক্যাশ আউট সেবা' : 'Bill payment & cash out services'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.type}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Card className={`overflow-hidden border-0 shadow-md ${service.shadowHover} transition-shadow duration-300`}>
                  <CardContent className="p-0">
                    {/* Gradient Header */}
                    <div className={`bg-gradient-to-br ${service.bgGradient} p-5 md:p-6`}>
                      <div className="flex items-start justify-between mb-4">
                        <motion.div
                          className="text-4xl md:text-5xl"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          {service.emoji}
                        </motion.div>
                        <Badge className={`${service.badgeBg} text-xs font-medium`}>
                          {isBn ? service.feeBn : service.feeEn}
                        </Badge>
                      </div>

                      <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                        {isBn ? service.nameBn : service.nameEn}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {!isBn ? service.nameBn : service.nameEn}
                      </p>
                      <p className="text-xs text-muted-foreground/80">
                        {isBn ? service.descriptionBn : service.descriptionEn}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="p-4 md:p-5 bg-white dark:bg-card">
                      <Button
                        className={`w-full gap-2 ${service.btnBg} font-semibold shadow-sm`}
                        size="lg"
                        onClick={() => handlePayNow(service.type)}
                      >
                        {isBn ? 'পেমেন্ট করুন' : 'Pay Now'}
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
