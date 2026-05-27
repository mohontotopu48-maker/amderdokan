'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Tag,
  Loader2,
  ArrowRight,
  ShoppingCart,
} from 'lucide-react'
import { useStore } from '@/store/use-store'
import { useToast } from '@/hooks/use-toast'

export function CartSheet() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    setCartItems,
    cartLoading,
    setCartLoading,
    language,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCartTotal,
    getCartItemCount,
    getCartSavings,
    setIsCheckoutOpen,
  } = useStore()

  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const isBn = language === 'bn'

  // Fetch cart from API on mount
  const fetchCart = useCallback(async () => {
    setCartLoading(true)
    try {
      const res = await fetch('/api/cart?userId=guest')
      if (res.ok) {
        const data = await res.json()
        const mappedItems = data.items.map(
          (item: Record<string, unknown>) => ({
            id: item.id as string,
            productId: (item as Record<string, unknown>).productId as string,
            productNameBn:
              ((item as Record<string, unknown>).product as Record<string, unknown>)
                ?.nameBn as string,
            productNameEn:
              ((item as Record<string, unknown>).product as Record<string, unknown>)
                ?.nameEn as string,
            price:
              ((item as Record<string, unknown>).product as Record<string, unknown>)
                ?.discountedPrice as number,
            originalPrice:
              ((item as Record<string, unknown>).product as Record<string, unknown>)
                ?.originalPrice as number | undefined,
            unit:
              ((item as Record<string, unknown>).product as Record<string, unknown>)
                ?.unit as string,
            quantity: item.quantity as number,
            image:
              Array.isArray(
                ((item as Record<string, unknown>).product as Record<string, unknown>)
                  ?.images
              )
                ? (
                    (
                      (item as Record<string, unknown>).product as Record<string, unknown>
                    ).images as string[]
                  )[0] || ''
                : '',
            discount:
              (
                (item as Record<string, unknown>).product as Record<string, unknown>
              )?.discount as number,
          })
        )
        setCartItems(mappedItems)
      }
    } catch {
      // silently fail, use local state
    } finally {
      setCartLoading(false)
    }
  }, [setCartItems, setCartLoading])

  useEffect(() => {
    if (isCartOpen) {
      fetchCart()
    }
  }, [isCartOpen, fetchCart])

  const handleUpdateQuantity = async (
    productId: string,
    cartItemId: string,
    newQuantity: number
  ) => {
    setUpdatingItems((prev) => new Set(prev).add(productId))
    updateCartItemQuantity(productId, newQuantity)

    try {
      if (newQuantity <= 0) {
        await fetch(`/api/cart/${cartItemId}`, { method: 'DELETE' })
      } else {
        await fetch(`/api/cart/${cartItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: newQuantity }),
        })
      }
    } catch {
      // API call failed, local state already updated
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  const handleRemoveItem = async (productId: string, cartItemId: string) => {
    removeFromCart(productId)
    try {
      await fetch(`/api/cart/${cartItemId}`, { method: 'DELETE' })
    } catch {
      // API call failed
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponError('')

    try {
      const subtotal = getCartTotal()
      const res = await fetch(
        `/api/coupons?code=${encodeURIComponent(couponCode.trim())}&totalAmount=${subtotal}`
      )
      const data = await res.json()

      if (data.valid) {
        setCouponDiscount(data.discountAmount)
        setCouponApplied(true)
        toast({
          title: isBn ? 'কুপন প্রয়োগ হয়েছে!' : 'Coupon applied!',
          description: isBn
            ? `৳${data.discountAmount} ছাড় পেয়েছেন`
            : `You saved ৳${data.discountAmount}`,
        })
      } else {
        setCouponError(data.error || 'Invalid coupon')
        setCouponDiscount(0)
        setCouponApplied(false)
      }
    } catch {
      setCouponError(isBn ? 'কুপন যাচাই করতে সমস্যা হয়েছে' : 'Failed to validate coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleCheckout = () => {
    setIsCartOpen(false)
    setTimeout(() => setIsCheckoutOpen(true), 300)
  }

  const subtotal = getCartTotal()
  const deliveryFee = subtotal > 500 ? 0 : 60
  const savings = getCartSavings()
  const total = subtotal - couponDiscount + deliveryFee
  const itemCount = getCartItemCount()

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-md"
      >
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="size-5 text-primary" />
            {isBn ? 'কেনাকাটার কার্ট' : 'Shopping Cart'}
            {itemCount > 0 && (
              <Badge variant="default" className="ml-1 bg-primary text-xs">
                {itemCount}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {isBn ? 'আপনার কার্টের আইটেমসমূহ' : 'Your cart items'}
          </SheetDescription>
        </SheetHeader>

        {cartLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
            <div className="flex size-24 items-center justify-center rounded-full bg-primary/10">
              <ShoppingBag className="size-12 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                {isBn ? 'আপনার কার্ট খালি' : 'Your cart is empty'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {isBn
                  ? 'পণ্য খুঁজুন এবং কার্টে যোগ করুন'
                  : 'Find products and add them to your cart'}
              </p>
            </div>
            <Button
              onClick={() => setIsCartOpen(false)}
              className="gap-2 bg-primary text-white hover:bg-primary/90"
            >
              <ShoppingBag className="size-4" />
              {isBn ? 'কেনাকাটা শুরু করুন' : 'Start Shopping'}
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-4 px-4">
              <div className="flex flex-col gap-3 py-2">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-3 rounded-lg border bg-card p-3 transition-shadow hover:shadow-md"
                  >
                    {/* Product Image/Emoji */}
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                      {item.image || '🛒'}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-medium leading-tight">
                            {isBn ? item.productNameBn : item.productNameEn}
                          </h4>
                          <p className="text-xs text-muted-foreground">{item.unit}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveItem(item.productId, item.id)}
                          disabled={updatingItems.has(item.productId)}
                          aria-label={isBn ? 'মুছুন' : 'Remove'}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {item.discount > 0 ? (
                            <>
                              <span className="text-sm font-semibold text-primary">
                                ৳{item.price * item.quantity}
                              </span>
                              {item.originalPrice && (
                                <span className="text-xs text-muted-foreground line-through">
                                  ৳{item.originalPrice * item.quantity}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-sm font-semibold">
                              ৳{item.price * item.quantity}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.id,
                                item.quantity - 1
                              )
                            }
                            disabled={updatingItems.has(item.productId)}
                            aria-label={isBn ? 'কমান' : 'Decrease'}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.id,
                                item.quantity + 1
                              )
                            }
                            disabled={updatingItems.has(item.productId)}
                            aria-label={isBn ? 'বাড়ান' : 'Increase'}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-3 border-t pt-3">
              {/* Coupon Code */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={isBn ? 'কুপন কোড' : 'Coupon code'}
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value)
                      setCouponError('')
                    }}
                    className="pl-8"
                    disabled={couponApplied}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || couponApplied || !couponCode.trim()}
                  className="shrink-0"
                >
                  {couponLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : couponApplied ? (
                    '✓'
                  ) : isBn ? (
                    'প্রয়োগ'
                  ) : (
                    'Apply'
                  )}
                </Button>
              </div>
              {couponError && (
                <p className="text-xs text-destructive">{couponError}</p>
              )}
              {couponApplied && couponDiscount > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  {isBn
                    ? `৳${couponDiscount} কুপন ছাড় প্রয়োগ হয়েছে`
                    : `৳${couponDiscount} coupon discount applied`}
                </p>
              )}

              {/* Cart Summary */}
              <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {isBn ? 'উপমোট' : 'Subtotal'}
                  </span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {isBn ? 'ডেলিভারি ফি' : 'Delivery Fee'}
                  </span>
                  <span
                    className={
                      deliveryFee === 0
                        ? 'text-green-600 dark:text-green-400'
                        : ''
                    }
                  >
                    {deliveryFee === 0
                      ? isBn
                        ? 'ফ্রি'
                        : 'Free'
                      : `৳${deliveryFee}`}
                  </span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {isBn ? 'সঞ্চয়' : 'Savings'}
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                      -৳{savings.toFixed(2)}
                    </span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {isBn ? 'কুপন ছাড়' : 'Coupon Discount'}
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                      -৳{couponDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                {subtotal <= 500 && subtotal > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {isBn
                      ? `ফ্রি ডেলিভারির জন্য আর ৳${(500 - subtotal).toFixed(0)} যোগ করুন`
                      : `Add ৳${(500 - subtotal).toFixed(0)} more for free delivery`}
                  </p>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>{isBn ? 'মোট' : 'Total'}</span>
                  <span className="text-primary">৳{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <SheetFooter className="flex-col gap-2 border-t pt-3 sm:flex-col">
              <Button
                className="w-full gap-2 bg-primary text-white hover:bg-primary/90"
                size="lg"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                {isBn ? 'চেকআউট করুন' : 'Checkout'}
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => setIsCartOpen(false)}
              >
                {isBn ? 'কেনাকাটা চালিয়ে যান' : 'Continue Shopping'}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
