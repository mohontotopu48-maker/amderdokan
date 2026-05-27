'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Star, ShoppingCart, Leaf, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useStore, type Product } from '@/store/use-store'

export function FeaturedProducts() {
  const { language, setSelectedProductId, setCurrentView, addToCart } = useStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/products?isFeatured=true&limit=8')
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products)
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId)
    setCurrentView('product-detail')
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()
    const discountedPrice = getDiscountedPrice(product)
    const productImage = Array.isArray(product.images) ? product.images[0] || '' : ''
    addToCart({
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      productNameBn: product.nameBn,
      productNameEn: product.nameEn,
      price: discountedPrice,
      originalPrice: product.originalPrice ?? undefined,
      unit: product.unit,
      quantity: 1,
      image: productImage,
      discount: product.discount,
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`size-3.5 ${
          i < Math.floor(rating)
            ? 'fill-amber-400 text-amber-400'
            : 'fill-muted text-muted'
        }`}
      />
    ))
  }

  const getDiscountedPrice = (product: Product) => {
    if (product.discountedPrice) return product.discountedPrice
    if (product.discount > 0) {
      return Math.round(product.price * (1 - product.discount / 100) * 100) / 100
    }
    return product.price
  }

  const getProductImage = (product: Product) => {
    return Array.isArray(product.images) ? product.images[0] || '🛍️' : '🛍️'
  }

  if (!loading && products.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-muted/50 to-background relative">
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "url('/bg-pattern.png')",
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
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40">
              <Award className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {language === 'bn' ? 'বিশেষ পণ্য' : 'Featured Products'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'আমাদের সেরা নির্বাচিত পণ্য' : 'Our handpicked selections'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-green-600 dark:text-green-400 hover:text-green-700"
            onClick={() => setCurrentView('products')}
          >
            {language === 'bn' ? 'আরও দেখুন' : 'View More'}
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </motion.div>

        {/* Featured Products Grid - Larger cards with more info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-xl h-80" />
                </div>
              ))
            : products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <Card
                    className="cursor-pointer border shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <CardContent className="p-0">
                      {/* Product Image Area - Larger for featured */}
                      <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-900/20 dark:to-teal-900/20 p-8 flex items-center justify-center min-h-[160px] md:min-h-[180px]">
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                          {getProductImage(product)}
                        </span>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {product.discount > 0 && (
                            <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2.5 py-1">
                              -{product.discount}%
                            </Badge>
                          )}
                          {product.isOrganic && (
                            <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs px-2.5 py-1">
                              <Leaf className="mr-1 size-3" />
                              {language === 'bn' ? 'জৈব' : 'Organic'}
                            </Badge>
                          )}
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 text-xs px-2.5 py-1 border-0">
                            <Award className="mr-1 size-3" />
                            {language === 'bn' ? 'বিশেষ' : 'Featured'}
                          </Badge>
                        </div>
                      </div>

                      <Separator />

                      {/* Product Info */}
                      <div className="p-4 space-y-3">
                        {/* Category */}
                        {product.category && (
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            {language === 'bn' ? product.category.nameBn : product.category.nameEn}
                          </p>
                        )}

                        <h3 className="font-semibold text-base leading-tight line-clamp-2">
                          {language === 'bn' ? product.nameBn : product.nameEn}
                        </h3>
                        {product.brand && (
                          <p className="text-xs italic text-muted-foreground/70 line-clamp-1">
                            {language === 'bn' ? product.brand.nameBn : product.brand.nameEn}
                          </p>
                        )}

                        {/* Rating */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex">{renderStars(product.rating)}</div>
                          <span className="text-xs text-muted-foreground">
                            {product.rating} ({product.reviewCount} {language === 'bn' ? 'রিভিউ' : 'reviews'})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-green-600 dark:text-green-400">
                            ৳{getDiscountedPrice(product)}
                          </span>
                          {product.originalPrice && product.discount > 0 && (
                            <span className="text-sm text-muted-foreground line-through">
                              ৳{product.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Unit & Savings */}
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{product.unit}</p>
                          {product.discount > 0 && product.originalPrice && (
                            <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
                              {language === 'bn' ? 'সাশ্রয়' : 'Save'} ৳{Math.round((product.originalPrice - getDiscountedPrice(product)) * 100) / 100}
                            </p>
                          )}
                        </div>

                        {/* Add to Cart */}
                        <Button
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          <ShoppingCart className="mr-1.5 size-4" />
                          {language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  )
}
