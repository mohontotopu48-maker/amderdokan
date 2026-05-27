'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/use-store'

interface Review {
  id: string
  nameBn: string
  nameEn: string
  rating: number
  textBn: string
  textEn: string
  productBn: string
  productEn: string
  initials: string
}

const HARDCODED_REVIEWS: Review[] = [
  {
    id: '1',
    nameBn: 'রহিমা বেগম',
    nameEn: 'Rahima Begum',
    rating: 5,
    textBn: 'অসাধারণ সার্ভিস! মাত্র ৪৫ মিনিটে ডেলিভারি পেলাম। সবজি একদম তাজা ছিল। আবার অর্ডার করব ইনশাআল্লাহ।',
    textEn: 'Amazing service! Got delivery in just 45 minutes. Vegetables were super fresh. Will order again InShaAllah.',
    productBn: 'তাজা সবজি',
    productEn: 'Fresh Vegetables',
    initials: 'রব',
  },
  {
    id: '2',
    nameBn: 'করিম উদ্দিন',
    nameEn: 'Karim Uddin',
    rating: 5,
    textBn: 'দাম অনেক সাশ্রয়ী। বাজারের চেয়ে কম দামে ভালো মানের পণ্য পাচ্ছি। বিশেষ করে মসলার কোয়ালিটি চমৎকার।',
    textEn: 'Very affordable prices. Better quality products at lower prices than the market. Especially the spice quality is excellent.',
    productBn: 'মসলা সেট',
    productEn: 'Spice Set',
    initials: 'কউ',
  },
  {
    id: '3',
    nameBn: 'ফাতেমা আক্তার',
    nameEn: 'Fatema Akter',
    rating: 4,
    textBn: 'ফ্রি ডেলিভারি অফারটা দারুণ! ৫০০ টাকার উপরে অর্ডার করলেই ফ্রি। প্যাকেজিংও খুব সুন্দর করে করে।',
    textEn: 'The free delivery offer is great! Free delivery on orders over 500 Taka. Packaging is also done very nicely.',
    productBn: 'চাল ও ডাল',
    productEn: 'Rice & Lentils',
    initials: 'ফআ',
  },
  {
    id: '4',
    nameBn: 'মোস্তফা কামাল',
    nameEn: 'Mostafa Kamal',
    rating: 5,
    textBn: 'bKash দিয়ে পেমেন্ট করা খুব সহজ হলো। ক্যাশ অন ডেলিভারিও আছে। ডেলিভারি ম্যান খুব ভদ্র ছিলেন।',
    textEn: 'Payment via bKash was very easy. Cash on delivery is also available. The delivery man was very polite.',
    productBn: 'ফলমূল',
    productEn: 'Fruits',
    initials: 'মক',
  },
  {
    id: '5',
    nameBn: 'নাসরিন সুলতানা',
    nameEn: 'Nasrin Sultana',
    rating: 5,
    textBn: 'জৈব শাকসবজি পাওয়া যায় এখানে। বাচ্চাদের জন্য নিরাপদ খাবার খুঁজছিলাম, এখন নিশ্চিন্তে এখান থেকে কিনি।',
    textEn: 'Organic vegetables are available here. Was looking for safe food for kids, now I buy from here with confidence.',
    productBn: 'জৈব শাকসবজি',
    productEn: 'Organic Vegetables',
    initials: 'নস',
  },
  {
    id: '6',
    nameBn: 'আব্দুল্লাহ আল মামুন',
    nameEn: 'Abdullah Al Mamun',
    rating: 4,
    textBn: 'WhatsApp এ অর্ডার করা যায়, এটা সুবিধাজনক। রাত ১০টায়ও অর্ডার করা যায়, এটা অনেক ভালো।',
    textEn: 'Can order via WhatsApp, which is convenient. Can even order at 10 PM, which is great.',
    productBn: 'দুধ ও দই',
    productEn: 'Milk & Yogurt',
    initials: 'আম',
  },
  {
    id: '7',
    nameBn: 'সাবরিনা চৌধুরী',
    nameEn: 'Sabrina Chowdhury',
    rating: 5,
    textBn: 'মাছের কোয়ালিটি অসাধারণ! বাজারের মাছের চেয়ে অনেক ভালো। পরিষ্কার করে দেওয়া হয়, তাই রান্না করতে সুবিধা হয়।',
    textEn: 'Fish quality is amazing! Much better than market fish. Cleaned and prepared, so cooking is convenient.',
    productBn: 'তাজা মাছ',
    productEn: 'Fresh Fish',
    initials: 'সচ',
  },
]

export function CustomerReviews() {
  const { language } = useStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviews, setReviews] = useState<Review[]>(HARDCODED_REVIEWS)
  const [itemsPerView, setItemsPerView] = useState(1)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Try to fetch reviews from API - for homepage we show general reviews
        // Since the API requires productId, we use hardcoded reviews for the homepage
        setReviews(HARDCODED_REVIEWS)
      } catch {
        setReviews(HARDCODED_REVIEWS)
      }
    }
    fetchReviews()
  }, [])

  // Set itemsPerView on client only to avoid hydration mismatch
  useEffect(() => {
    const updateItemsPerView = () => {
      setItemsPerView(window.innerWidth >= 768 ? 3 : 1)
    }
    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  const maxIndex = Math.max(0, reviews.length - itemsPerView)

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`size-4 ${
          i < rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'
        }`}
      />
    ))
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30 relative">
      {/* Pattern background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "url('/bg-home.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {language === 'bn' ? 'আমাদের গ্রাহকরা কী বলেন' : 'What Our Customers Say'}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {language === 'bn'
              ? 'আমাদের সম্মানিত গ্রাহকদের মতামত'
              : 'Reviews from our valued customers'}
          </p>
        </motion.div>

        {/* Reviews Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-end gap-2 mb-4">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {/* Reviews Grid */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4 md:gap-6"
              animate={{ x: `-${currentIndex * (100 / itemsPerView + 2)}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="min-w-full md:min-w-[calc(33.333%-16px)]"
                >
                  <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                    <CardContent className="p-5 md:p-6 flex flex-col h-full">
                      {/* Quote Icon */}
                      <Quote className="size-8 text-green-200 dark:text-green-800 mb-3" />

                      {/* Review Text */}
                      <p className="text-sm md:text-base text-foreground leading-relaxed flex-1 mb-4">
                        &ldquo;{language === 'bn' ? review.textBn : review.textEn}&rdquo;
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-0.5 mb-4">
                        {renderStars(review.rating)}
                      </div>

                      {/* Product Badge */}
                      <Badge variant="secondary" className="w-fit text-xs mb-4">
                        {language === 'bn' ? review.productBn : review.productEn}
                      </Badge>

                      {/* Customer Info */}
                      <div className="flex items-center gap-3 pt-3 border-t">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-sm font-semibold">
                            {review.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">
                            {language === 'bn' ? review.nameBn : review.nameEn}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {language === 'bn' ? 'সম্মানিত গ্রাহক' : 'Verified Customer'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
