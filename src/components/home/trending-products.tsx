'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Star, ShoppingCart, Leaf, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useStore, type Product } from '@/store/use-store'

export function TrendingProducts() {
  const { language, setSelectedProductId, setCurrentView, addToCart } = useStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/products?isTrending=true&limit=12')
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products)
        }
      } catch (error) {
        console.error('Failed to fetch trending products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [])

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId)
    setCurrentView('product-detail')
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()
    addToCart({
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      productNameBn: product.nameBn,
      productNameEn: product.nameEn,
      price: product.originalPrice && product.discount > 0
        ? Math.round(product.originalPrice * (1 - product.discount / 100) * 100) / 100
        : product.price,
      originalPrice: product.originalPrice ?? undefined,
      unit: product.unit,
      quantity: 1,
      image: product.images,
      discount: product.discount,
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`size-3 ${
          i < Math.floor(rating)
            ? 'fill-amber-400 text-amber-400'
            : 'fill-muted text-muted'
        }`}
      />
    ))
  }

  const getDiscountedPrice = (product: Product) => {
    if (product.discount > 0 && product.originalPrice) {
      return Math.round(product.originalPrice * (1 - product.discount / 100) * 100) / 100
    }
    return product.price
  }

  if (!loading && products.length === 0) return null

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
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/40">
              <TrendingUp className="size-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {language === 'bn' ? 'ট্রেন্ডিং পণ্য' : 'Trending Products'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'সবচেয়ে জনপ্রিয় পণ্যসমূহ' : 'Most popular items'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-orange-600 dark:text-orange-400 hover:text-orange-700"
            onClick={() => {
              setCurrentView('products')
            }}
          >
            {language === 'bn' ? 'আরও দেখুন' : 'View More'}
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </motion.div>

        {/* Products - Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse min-w-[220px] md:min-w-0">
                  <div className="bg-muted rounded-xl h-64" />
                </div>
              ))
            : products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="min-w-[220px] md:min-w-0"
                >
                  <Card
                    className="cursor-pointer border shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <CardContent className="p-0">
                      {/* Product Image Area */}
                      <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-900/20 p-6 flex items-center justify-center min-h-[140px]">
                        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                          {product.images || '🛍️'}
                        </span>

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {product.discount > 0 && (
                            <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-0.5">
                              -{product.discount}%
                            </Badge>
                          )}
                          {product.isOrganic && (
                            <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-0.5">
                              <Leaf className="mr-1 size-3" />
                              {language === 'bn' ? 'জৈব' : 'Organic'}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-3 md:p-4 space-y-2">
                        <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                          {language === 'bn' ? product.nameBn : product.nameEn}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          <div className="flex">{renderStars(product.rating)}</div>
                          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            ৳{getDiscountedPrice(product)}
                          </span>
                          {product.originalPrice && product.discount > 0 && (
                            <span className="text-sm text-muted-foreground line-through">
                              ৳{product.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Unit */}
                        <p className="text-xs text-muted-foreground">{product.unit}</p>

                        {/* Add to Cart */}
                        <Button
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700 text-white mt-2"
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          <ShoppingCart className="mr-1.5 size-3.5" />
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
