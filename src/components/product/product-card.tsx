'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Loader2,
  Leaf,
  Package,
  Check,
} from 'lucide-react'
import { useStore, type Product } from '@/store/use-store'
import { useToast } from '@/hooks/use-toast'

interface ProductCardProps {
  product: Product
  onClick?: (product: Product) => void
}

// Mini confetti particles for add-to-cart success
function MiniConfetti({ show }: { show: boolean }) {
  if (!show) return null
  const particles = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 60,
    y: -(20 + Math.random() * 30),
    color: ['#16a34a', '#f97316', '#22c55e', '#fb923c', '#eab308'][i % 5],
    size: 3 + Math.random() * 4,
    rotation: Math.random() * 360,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: '50%', y: '50%', scale: 0, opacity: 1 }}
          animate={{
            x: `calc(50% + ${p.x}px)`,
            y: `calc(50% + ${p.y}px)`,
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
            rotate: p.rotation,
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  )
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { language, addToCart, updateCartItemId, setSelectedProductId, setCurrentView } = useStore()
  const isBn = language === 'bn'
  const { toast } = useToast()

  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [imageLoaded, setImageLoaded] = useState(true) // Emoji images are always "loaded"
  const [starsVisible, setStarsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Trigger star animation when card comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setStarsVisible(true), 300)
        }
      },
      { threshold: 0.3 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  const isOutOfStock = product.stock <= 0
  const hasDiscount = product.discount > 0
  const discountedPrice = product.discountedPrice ?? (hasDiscount
    ? Math.round(product.price * (1 - product.discount / 100) * 100) / 100
    : product.price)

  const productImage = Array.isArray(product.images) ? product.images[0] || '' : ''

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isOutOfStock) return

    setAddingToCart(true)

    // Add to local store
    addToCart({
      id: `temp-${product.id}-${Date.now()}`,
      productId: product.id,
      productNameBn: product.nameBn,
      productNameEn: product.nameEn,
      price: discountedPrice,
      originalPrice: product.originalPrice ?? undefined,
      unit: product.unit,
      quantity,
      image: productImage,
      discount: product.discount,
    })

    // Sync with API
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'guest',
          productId: product.id,
          quantity,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.cartItem?.id) {
          updateCartItemId(product.id, data.cartItem.id)
        }
      }
    } catch {
      // API call failed, local state already updated
    }

    // Show success feedback
    setAddingToCart(false)
    setAddedToCart(true)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 800)
    setTimeout(() => setAddedToCart(false), 1500)
    setQuantity(1)

    toast({
      title: isBn ? 'কার্টে যোগ হয়েছে!' : 'Added to cart!',
      description: isBn
        ? `${product.nameBn} কার্টে যোগ করা হয়েছে`
        : `${product.nameEn} added to your cart`,
    })
  }

  const handleClick = () => {
    if (onClick) {
      onClick(product)
    } else {
      setSelectedProductId(product.id)
      setCurrentView('product-detail')
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star, i) => (
          <motion.div
            key={star}
            initial={{ scale: 0, opacity: 0 }}
            animate={starsVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              delay: i * 0.08,
              type: 'spring',
              stiffness: 300,
              damping: 15,
            }}
          >
            <Star
              className={`size-3 ${
                star <= Math.round(rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-muted-foreground/30'
              }`}
            />
          </motion.div>
        ))}
        <span className="ml-1 text-xs text-muted-foreground">
          ({product.reviewCount})
        </span>
      </div>
    )
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative"
    >
      <Card
        className="group relative cursor-pointer overflow-hidden border transition-all duration-300 hover:shadow-xl"
        onClick={handleClick}
      >
        {/* Mini Confetti */}
        <MiniConfetti show={showConfetti} />

        {/* Badges */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          {hasDiscount && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Badge className="bg-orange-500 text-[10px] text-white hover:bg-orange-600 animate-discount-glow">
                -{product.discount}%
              </Badge>
            </motion.div>
          )}
          {product.isOrganic && (
            <Badge className="bg-green-600 text-[10px] text-white hover:bg-green-700">
              <Leaf className="mr-0.5 size-2.5" />
              {isBn ? 'জৈব' : 'Organic'}
            </Badge>
          )}
        </div>

        {/* Image Area with Zoom */}
        <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
          {/* Shimmer loading overlay */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted">
              <div className="absolute inset-0 animate-shimmer" />
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <Badge variant="secondary" className="text-xs">
                <Package className="mr-1 size-3" />
                {isBn ? 'স্টক আউট' : 'Out of Stock'}
              </Badge>
            </div>
          )}
          <motion.span
            className="text-5xl"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {productImage || '🛒'}
          </motion.span>
        </div>

        <CardContent className="space-y-2 p-3">
          {/* Product Name */}
          <div>
            <h3 className="line-clamp-1 text-sm font-semibold leading-tight">
              {isBn ? product.nameBn : product.nameEn}
            </h3>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {!isBn ? product.nameBn : product.nameEn}
            </p>
            {product.brand && (
              <p className="line-clamp-1 text-xs italic text-muted-foreground/70">
                {isBn ? product.brand.nameBn : product.brand.nameEn}
              </p>
            )}
          </div>

          {/* Rating with Staggered Animation */}
          {renderStars(product.rating)}

          {/* Unit */}
          <p className="text-xs text-muted-foreground">{product.unit}</p>

          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-primary">
              ৳{discountedPrice}
            </span>
            {hasDiscount && product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ৳{product.originalPrice}
              </span>
            )}
          </div>

          {/* Add to Cart - Animated Button */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center rounded-md border">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={(e) => {
                  e.stopPropagation()
                  setQuantity(Math.max(1, quantity - 1))
                }}
                disabled={isOutOfStock}
                aria-label={isBn ? 'কমান' : 'Decrease'}
              >
                <Minus className="size-3" />
              </Button>
              <span className="w-6 text-center text-xs font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={(e) => {
                  e.stopPropagation()
                  setQuantity(Math.min(product.stock, quantity + 1))
                }}
                disabled={isOutOfStock}
                aria-label={isBn ? 'বাড়ান' : 'Increase'}
              >
                <Plus className="size-3" />
              </Button>
            </div>
            <motion.div className="flex-1" layout>
              <Button
                size="sm"
                className="w-full gap-1 bg-primary text-white hover:bg-primary/90 text-xs overflow-hidden relative"
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.span
                      key="added"
                      initial={{ scale: 0, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0, y: -10 }}
                      className="flex items-center gap-1"
                    >
                      <Check className="size-3.5" />
                      {isBn ? 'যোগ হয়েছে!' : 'Added!'}
                    </motion.span>
                  ) : addingToCart ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1"
                    >
                      <Loader2 className="size-3.5 animate-spin" />
                      {isBn ? 'যোগ হচ্ছে...' : 'Adding...'}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1"
                    >
                      <ShoppingCart className="size-3.5" />
                      {isBn ? 'কার্টে যোগ' : 'Add'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
