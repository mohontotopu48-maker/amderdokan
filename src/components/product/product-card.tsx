'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import { useStore, type Product } from '@/store/use-store'
import { useToast } from '@/hooks/use-toast'

interface ProductCardProps {
  product: Product
  onClick?: (product: Product) => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { language, addToCart, setSelectedProductId, setCurrentView } = useStore()
  const isBn = language === 'bn'
  const { toast } = useToast()

  const [addingToCart, setAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const isOutOfStock = product.stock <= 0
  const hasDiscount = product.discount > 0
  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - product.discount / 100) * 100) / 100
    : product.price

  const parsedImages: string[] = (() => {
    try {
      return JSON.parse(product.images)
    } catch {
      return []
    }
  })()

  const productImage = parsedImages[0] || ''

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
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'guest',
          productId: product.id,
          quantity,
        }),
      })
    } catch {
      // API call failed, local state already updated
    }

    toast({
      title: isBn ? 'কার্টে যোগ হয়েছে!' : 'Added to cart!',
      description: isBn
        ? `${product.nameBn} কার্টে যোগ করা হয়েছে`
        : `${product.nameEn} added to your cart`,
    })

    setAddingToCart(false)
    setQuantity(1)
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
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`size-3 ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-muted-foreground/30'
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-muted-foreground">
          ({product.reviewCount})
        </span>
      </div>
    )
  }

  return (
    <Card
      className="group relative cursor-pointer overflow-hidden border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
      onClick={handleClick}
    >
      {/* Badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {hasDiscount && (
          <Badge className="bg-orange-500 text-[10px] text-white hover:bg-orange-600">
            -{product.discount}%
          </Badge>
        )}
        {product.isOrganic && (
          <Badge className="bg-green-600 text-[10px] text-white hover:bg-green-700">
            <Leaf className="mr-0.5 size-2.5" />
            {isBn ? 'জৈব' : 'Organic'}
          </Badge>
        )}
      </div>

      {/* Image Area */}
      <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
        {isOutOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Badge variant="secondary" className="text-xs">
              <Package className="mr-1 size-3" />
              {isBn ? 'স্টক আউট' : 'Out of Stock'}
            </Badge>
          </div>
        )}
        <span className="text-5xl transition-transform duration-200 group-hover:scale-110">
          {productImage || '🛒'}
        </span>
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
        </div>

        {/* Rating */}
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

        {/* Add to Cart */}
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
          <Button
            size="sm"
            className="flex-1 gap-1 bg-primary text-white hover:bg-primary/90 text-xs"
            onClick={handleAddToCart}
            disabled={isOutOfStock || addingToCart}
          >
            {addingToCart ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <ShoppingCart className="size-3.5" />
            )}
            {isBn ? 'কার্টে যোগ' : 'Add'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
