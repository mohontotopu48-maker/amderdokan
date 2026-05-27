'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Loader2,
  Leaf,
  Package,
  ChevronRight,
  MessageSquare,
  Send,
  User,
} from 'lucide-react'
import { useStore, type Product } from '@/store/use-store'
import { useToast } from '@/hooks/use-toast'
import { ProductCard } from './product-card'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: {
    id: string
    name: string
  }
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
  distribution: Record<number, number>
}

export function ProductDetail() {
  const {
    selectedProductId,
    language,
    products,
    categories,
    addToCart,
    setCurrentView,
    setSelectedCategoryId,
    setSelectedProductId,
  } = useStore()

  const isBn = language === 'bn'
  const { toast } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null)
  const [reviewsLoading, setReviewsLoading] = useState(false)

  const [newReviewRating, setNewReviewRating] = useState(5)
  const [newReviewComment, setNewReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  // Find product from store first, then fetch
  const storeProduct = products.find((p) => p.id === selectedProductId)

  const fetchProduct = useCallback(async () => {
    if (!selectedProductId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${selectedProductId}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data)
      } else {
        setProduct(storeProduct || null)
      }
    } catch {
      setProduct(storeProduct || null)
    } finally {
      setLoading(false)
    }
  }, [selectedProductId, storeProduct])

  const fetchReviews = useCallback(async () => {
    if (!selectedProductId) return
    setReviewsLoading(true)
    try {
      const res = await fetch(`/api/reviews?productId=${selectedProductId}`)
      if (res.ok) {
        const data = await res.json()
        setReviews(data.reviews || [])
        setReviewStats(data.stats || null)
      }
    } catch {
      // silently fail
    } finally {
      setReviewsLoading(false)
    }
  }, [selectedProductId])

  useEffect(() => {
    fetchProduct()
    fetchReviews()
  }, [fetchProduct, fetchReviews])

  const displayProduct = product || storeProduct

  const isOutOfStock = displayProduct ? displayProduct.stock <= 0 : false
  const hasDiscount = displayProduct ? displayProduct.discount > 0 : false
  const discountedPrice = displayProduct
    ? displayProduct.discountedPrice ?? (hasDiscount
      ? Math.round(displayProduct.price * (1 - displayProduct.discount / 100) * 100) / 100
      : displayProduct.price)
    : 0

  const productImage = displayProduct
    ? Array.isArray(displayProduct.images) ? displayProduct.images[0] || '' : ''
    : ''

  const category = displayProduct?.category ||
    categories.find((c) => c.id === displayProduct?.categoryId)

  // Related products
  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== displayProduct?.id &&
        p.categoryId === displayProduct?.categoryId &&
        p.isActive
    )
    .slice(0, 4)

  const handleAddToCart = async () => {
    if (!displayProduct || isOutOfStock) return

    setAddingToCart(true)
    addToCart({
      id: `temp-${displayProduct.id}-${Date.now()}`,
      productId: displayProduct.id,
      productNameBn: displayProduct.nameBn,
      productNameEn: displayProduct.nameEn,
      price: discountedPrice,
      originalPrice: displayProduct.originalPrice ?? undefined,
      unit: displayProduct.unit,
      quantity,
      image: productImage,
      discount: displayProduct.discount,
    })

    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'guest',
          productId: displayProduct.id,
          quantity,
        }),
      })
    } catch {
      // API call failed
    }

    toast({
      title: isBn ? 'কার্টে যোগ হয়েছে!' : 'Added to cart!',
      description: isBn
        ? `${displayProduct.nameBn} কার্টে যোগ করা হয়েছে`
        : `${displayProduct.nameEn} added to your cart`,
    })
    setAddingToCart(false)
  }

  const handleSubmitReview = async () => {
    if (!displayProduct || !newReviewComment.trim()) return

    setSubmittingReview(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'guest',
          productId: displayProduct.id,
          rating: newReviewRating,
          comment: newReviewComment.trim(),
        }),
      })

      if (res.ok) {
        toast({
          title: isBn ? 'রিভিউ দেওয়া হয়েছে!' : 'Review submitted!',
          description: isBn
            ? 'আপনার রিভিউর জন্য ধন্যবাদ'
            : 'Thank you for your review',
        })
        setNewReviewComment('')
        setNewReviewRating(5)
        fetchReviews()
      } else {
        const data = await res.json()
        toast({
          title: isBn ? 'রিভিউ ব্যর্থ' : 'Review failed',
          description: data.error || 'Something went wrong',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: isBn ? 'রিভিউ ব্যর্থ' : 'Review failed',
        description: isBn ? 'নেটওয়ার্ক সমস্যা' : 'Network error',
        variant: 'destructive',
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'md' ? 'size-5' : 'size-4'
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    )
  }

  const renderInteractiveStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setNewReviewRating(star)}
            className="transition-transform hover:scale-110"
            aria-label={`${star} ${isBn ? 'তারা' : 'star'}`}
          >
            <Star
              className={`size-6 ${
                star <= newReviewRating
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-muted-foreground/30'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const handleBack = () => {
    setCurrentView('home')
    setSelectedProductId(null)
  }

  const handleCategoryClick = () => {
    if (category) {
      setSelectedCategoryId(category.id)
      setCurrentView('products')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <Skeleton className="h-8 w-24" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!displayProduct) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <Package className="size-16 text-muted-foreground" />
        <p className="text-lg font-medium text-muted-foreground">
          {isBn ? 'পণ্য পাওয়া যায়নি' : 'Product not found'}
        </p>
        <Button onClick={handleBack} variant="outline" className="gap-1.5">
          <ArrowLeft className="size-4" />
          {isBn ? 'ফিরে যান' : 'Go Back'}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="gap-1.5 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {isBn ? 'ফিরে যান' : 'Go Back'}
      </Button>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <button
          onClick={handleBack}
          className="hover:text-foreground transition-colors"
        >
          {isBn ? 'হোম' : 'Home'}
        </button>
        <ChevronRight className="size-3.5" />
        {category && (
          <>
            <button
              onClick={handleCategoryClick}
              className="hover:text-foreground transition-colors"
            >
              {isBn ? category.nameBn : category.nameEn}
            </button>
            <ChevronRight className="size-3.5" />
          </>
        )}
        <span className="truncate text-foreground">
          {isBn ? displayProduct.nameBn : displayProduct.nameEn}
        </span>
      </nav>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Image */}
        <div className="relative flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
          {isOutOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <Badge variant="secondary" className="text-sm">
                <Package className="mr-1 size-4" />
                {isBn ? 'স্টক আউট' : 'Out of Stock'}
              </Badge>
            </div>
          )}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            {hasDiscount && (
              <Badge className="bg-orange-500 text-white hover:bg-orange-600">
                -{displayProduct.discount}%
              </Badge>
            )}
            {displayProduct.isOrganic && (
              <Badge className="bg-green-600 text-white hover:bg-green-700">
                <Leaf className="mr-1 size-3" />
                {isBn ? 'জৈব' : 'Organic'}
              </Badge>
            )}
          </div>
          <span className="text-8xl">{productImage || '🛒'}</span>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {isBn ? displayProduct.nameBn : displayProduct.nameEn}
            </h1>
            <p className="mt-1 text-lg text-muted-foreground">
              {!isBn ? displayProduct.nameBn : displayProduct.nameEn}
            </p>
            {displayProduct.brand && (
              <p className="mt-1 text-xs italic text-muted-foreground/70">
                {isBn ? displayProduct.brand.nameBn : displayProduct.brand.nameEn}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {renderStars(displayProduct.rating, 'md')}
            <span className="text-sm text-muted-foreground">
              {displayProduct.rating.toFixed(1)} ({displayProduct.reviewCount}{' '}
              {isBn ? 'রিভিউ' : 'reviews'})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              ৳{discountedPrice}
            </span>
            {hasDiscount && displayProduct.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                ৳{displayProduct.originalPrice}
              </span>
            )}
            {hasDiscount && (
              <Badge className="bg-orange-500 text-white">
                {isBn ? `${displayProduct.discount}% ছাড়` : `${displayProduct.discount}% OFF`}
              </Badge>
            )}
          </div>

          {/* Unit */}
          <p className="text-sm text-muted-foreground">
            {isBn ? 'একক' : 'Unit'}: {displayProduct.unit}
          </p>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div
              className={`size-2.5 rounded-full ${
                isOutOfStock
                  ? 'bg-red-500'
                  : displayProduct.stock <= 5
                    ? 'bg-amber-500'
                    : 'bg-green-500'
              }`}
            />
            <span className="text-sm font-medium">
              {isOutOfStock
                ? isBn
                  ? 'স্টক আউট'
                  : 'Out of Stock'
                : displayProduct.stock <= 5
                  ? isBn
                    ? `মাত্র ${displayProduct.stock}টি বাকি`
                    : `Only ${displayProduct.stock} left`
                  : isBn
                    ? 'স্টকে আছে'
                    : 'In Stock'}
            </span>
          </div>

          <Separator />

          {/* Description */}
          {(displayProduct.descriptionBn || displayProduct.descriptionEn) && (
            <div>
              <h3 className="mb-2 font-semibold">
                {isBn ? 'বিবরণ' : 'Description'}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {isBn
                  ? displayProduct.descriptionBn || displayProduct.descriptionEn
                  : displayProduct.descriptionEn || displayProduct.descriptionBn}
              </p>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-lg border">
              <Button
                variant="ghost"
                size="icon"
                className="size-10"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={isOutOfStock}
                aria-label={isBn ? 'কমান' : 'Decrease'}
              >
                <Minus className="size-4" />
              </Button>
              <span className="w-10 text-center text-base font-semibold">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-10"
                onClick={() =>
                  setQuantity(Math.min(displayProduct.stock, quantity + 1))
                }
                disabled={isOutOfStock}
                aria-label={isBn ? 'বাড়ান' : 'Increase'}
              >
                <Plus className="size-4" />
              </Button>
            </div>
            <Button
              size="lg"
              className="flex-1 gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={handleAddToCart}
              disabled={isOutOfStock || addingToCart}
            >
              {addingToCart ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <ShoppingCart className="size-5" />
              )}
              {isBn ? 'কার্টে যোগ করুন' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6">
        <Separator />
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <MessageSquare className="size-5 text-primary" />
            {isBn ? 'রিভিউ ও মতামত' : 'Reviews & Ratings'}
          </h2>

          {/* Review Stats */}
          {reviewStats && reviewStats.totalReviews > 0 && (
            <div className="mt-4 flex items-center gap-6 rounded-lg border p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {reviewStats.averageRating.toFixed(1)}
                </div>
                {renderStars(reviewStats.averageRating, 'md')}
                <p className="mt-1 text-xs text-muted-foreground">
                  {reviewStats.totalReviews} {isBn ? 'রিভিউ' : 'reviews'}
                </p>
              </div>
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="w-3 text-xs text-muted-foreground">{star}</span>
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all"
                        style={{
                          width: `${
                            reviewStats.totalReviews > 0
                              ? ((reviewStats.distribution[star] || 0) /
                                  reviewStats.totalReviews) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs text-muted-foreground">
                      {reviewStats.distribution[star] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Review Form */}
          <div className="mt-6 rounded-lg border p-4">
            <h3 className="mb-3 font-semibold">
              {isBn ? 'রিভিউ লিখুন' : 'Write a Review'}
            </h3>
            <div className="space-y-3">
              <div>
                <Label>{isBn ? 'রেটিং' : 'Rating'}</Label>
                <div className="mt-1">{renderInteractiveStars()}</div>
              </div>
              <div>
                <Label htmlFor="review-comment">
                  {isBn ? 'মন্তব্য' : 'Comment'}
                </Label>
                <Textarea
                  id="review-comment"
                  placeholder={
                    isBn
                      ? 'আপনার অভিজ্ঞতা শেয়ার করুন...'
                      : 'Share your experience...'
                  }
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button
                onClick={handleSubmitReview}
                disabled={submittingReview || !newReviewComment.trim()}
                className="gap-1.5 bg-primary text-white hover:bg-primary/90"
              >
                {submittingReview ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                {isBn ? 'রিভিউ জমা দিন' : 'Submit Review'}
              </Button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="mt-4 space-y-3">
            {reviewsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2 rounded-lg border p-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                        <User className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{review.user.name}</p>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString(
                        isBn ? 'bn-BD' : 'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                {isBn
                  ? 'এখনো কোনো রিভিউ নেই। প্রথম রিভিউ লিখুন!'
                  : 'No reviews yet. Be the first to review!'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <Separator />
          <h2 className="text-xl font-bold">
            {isBn ? 'সম্পর্কিত পণ্য' : 'Related Products'}
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => {
                  setSelectedProductId(p.id)
                  setCurrentView('product-detail')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
