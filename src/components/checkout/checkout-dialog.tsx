'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  MapPin,
  Phone,
  User,
  CreditCard,
  ShoppingBag,
  MessageSquare,
  Truck,
  PartyPopper,
  Tag,
} from 'lucide-react'
import { useStore } from '@/store/use-store'
import { useToast } from '@/hooks/use-toast'

const DELIVERY_AREAS = [
  { value: 'dhaka-mirpur', labelBn: 'ঢাকা - মিরপুর', labelEn: 'Dhaka - Mirpur' },
  { value: 'dhaka-dhanmondi', labelBn: 'ঢাকা - ধানমন্ডি', labelEn: 'Dhaka - Dhanmondi' },
  { value: 'dhaka-gulshan', labelBn: 'ঢাকা - গুলশান', labelEn: 'Dhaka - Gulshan' },
  { value: 'dhaka-uttara', labelBn: 'ঢাকা - উত্তরা', labelEn: 'Dhaka - Uttara' },
  { value: 'dhaka-mohammadpur', labelBn: 'ঢাকা - মোহাম্মদপুর', labelEn: 'Dhaka - Mohammadpur' },
  { value: 'dhaka-bashundhara', labelBn: 'ঢাকা - বসুন্ধরা', labelEn: 'Dhaka - Bashundhara' },
  { value: 'dhaka-old', labelBn: 'ঢাকা - পুরান ঢাকা', labelEn: 'Dhaka - Old Dhaka' },
  { value: 'chittagong', labelBn: 'চট্টগ্রাম', labelEn: 'Chittagong' },
  { value: 'sylhet', labelBn: 'সিলেট', labelEn: 'Sylhet' },
  { value: 'rajshahi', labelBn: 'রাজশাহী', labelEn: 'Rajshahi' },
  { value: 'khulna', labelBn: 'খুলনা', labelEn: 'Khulna' },
  { value: 'other', labelBn: 'অন্যান্য', labelEn: 'Other' },
]

interface DeliveryForm {
  name: string
  phone: string
  address: string
  area: string
  notes: string
}

interface FormErrors {
  name?: string
  phone?: string
  address?: string
  area?: string
  paymentPhone?: string
}

export function CheckoutDialog() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartItems,
    getCartTotal,
    getCartSavings,
    language,
    clearCart,
    appliedCoupon,
    couponDiscountAmount,
    setAppliedCoupon,
    setCouponDiscountAmount,
  } = useStore()

  const isBn = language === 'bn'
  const { toast } = useToast()

  const [step, setStep] = useState(1)
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')

  const [deliveryForm, setDeliveryForm] = useState<DeliveryForm>({
    name: '',
    phone: '',
    address: '',
    area: '',
    notes: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [paymentPhone, setPaymentPhone] = useState('')
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  // Initialize with coupon from store (applied in cart)
  const [couponDiscount, setCouponDiscount] = useState(couponDiscountAmount)
  const [checkoutCoupon, setCheckoutCoupon] = useState(appliedCoupon || '')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponApplied, setCouponApplied] = useState(!!appliedCoupon)
  const [couponError, setCouponError] = useState('')

  const subtotal = getCartTotal()
  const savings = getCartSavings()
  const deliveryFee = subtotal > 500 ? 0 : 60
  const total = Math.max(0, subtotal - couponDiscount + deliveryFee)

  const validateStep1 = (): boolean => {
    const errors: FormErrors = {}
    if (!deliveryForm.name.trim()) {
      errors.name = isBn ? 'নাম আবশ্যক' : 'Name is required'
    }
    if (!deliveryForm.phone.trim()) {
      errors.phone = isBn ? 'ফোন নম্বর আবশ্যক' : 'Phone number is required'
    } else if (!/^01[3-9]\d{8}$/.test(deliveryForm.phone.trim())) {
      errors.phone = isBn ? 'সঠিক ফোন নম্বর দিন' : 'Enter a valid phone number'
    }
    if (!deliveryForm.address.trim()) {
      errors.address = isBn ? 'ঠিকানা আবশ্যক' : 'Address is required'
    }
    if (!deliveryForm.area) {
      errors.area = isBn ? 'এলাকা নির্বাচন করুন' : 'Select an area'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep2 = (): boolean => {
    const errors: FormErrors = {}
    if (
      (paymentMethod === 'bkash' ||
        paymentMethod === 'nagad' ||
        paymentMethod === 'rocket') &&
      paymentPhone.trim()
    ) {
      if (!/^01[3-9]\d{8}$/.test(paymentPhone.trim())) {
        errors.paymentPhone = isBn ? 'সঠিক ফোন নম্বর দিন' : 'Enter a valid phone number'
      }
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep((prev) => Math.min(prev + 1, 3))
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handlePlaceOrder = async () => {
    setOrderLoading(true)
    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'guest',
          items: orderItems,
          deliveryAddress: `${deliveryForm.address}, ${DELIVERY_AREAS.find((a) => a.value === deliveryForm.area)?.labelBn || deliveryForm.area}`,
          deliveryPhone: deliveryForm.phone,
          paymentMethod,
          couponCode: couponApplied ? checkoutCoupon : (appliedCoupon || null),
          notes: deliveryForm.notes || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({
          title: isBn ? 'অর্ডার ব্যর্থ' : 'Order failed',
          description: data.error || 'Something went wrong',
          variant: 'destructive',
        })
        return
      }

      setOrderId(data.order?.id || '')
      setOrderSuccess(true)
      clearCart()
      toast({
        title: isBn ? 'অর্ডার সফল!' : 'Order placed!',
        description: isBn
          ? 'আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে'
          : 'Your order has been placed successfully',
      })
    } catch {
      toast({
        title: isBn ? 'অর্ডার ব্যর্থ' : 'Order failed',
        description: isBn
          ? 'নেটওয়ার্ক সমস্যা হয়েছে'
          : 'Network error occurred',
        variant: 'destructive',
      })
    } finally {
      setOrderLoading(false)
    }
  }

  const handleClose = (open: boolean) => {
    setIsCheckoutOpen(open)
    if (!open) {
      setTimeout(() => {
        setStep(1)
        setOrderSuccess(false)
        setOrderId('')
        setFormErrors({})
        setDeliveryForm({ name: '', phone: '', address: '', area: '', notes: '' })
        setPaymentMethod('cod')
        setPaymentPhone('')
        // Reset coupon state but keep store values as fallback
        setCouponDiscount(0)
        setCheckoutCoupon('')
        setCouponLoading(false)
        setCouponApplied(false)
        setCouponError('')
        setAppliedCoupon(null)
        setCouponDiscountAmount(0)
      }, 300)
    }
  }

  const stepLabels = [
    isBn ? 'ডেলিভারি' : 'Delivery',
    isBn ? 'পেমেন্ট' : 'Payment',
    isBn ? 'সারসংক্ষেপ' : 'Summary',
  ]

  const whatsappMessage = encodeURIComponent(
    isBn
      ? `আসসালামু আলাইকুম! আমি অর্ডার করেছি। অর্ডার আইডি: ${orderId}\nনাম: ${deliveryForm.name}\nফোন: ${deliveryForm.phone}\nঠিকানা: ${deliveryForm.address}\nমোট: ৳${total.toFixed(2)}`
      : `Hello! I have placed an order. Order ID: ${orderId}\nName: ${deliveryForm.name}\nPhone: ${deliveryForm.phone}\nAddress: ${deliveryForm.address}\nTotal: ৳${total.toFixed(2)}`
  )

  const paymentMethods = useMemo(
    () => [
      {
        value: 'cod',
        labelBn: 'ক্যাশ অন ডেলিভারি',
        labelEn: 'Cash on Delivery',
        icon: Truck,
        color: 'text-green-600',
      },
      {
        value: 'bkash',
        labelBn: 'বিকাশ',
        labelEn: 'bKash',
        icon: Phone,
        color: 'text-pink-600',
      },
      {
        value: 'nagad',
        labelBn: 'নগদ',
        labelEn: 'Nagad',
        icon: Phone,
        color: 'text-orange-600',
      },
      {
        value: 'rocket',
        labelBn: 'রকেট',
        labelEn: 'Rocket',
        icon: Phone,
        color: 'text-purple-600',
      },
    ],
    []
  )

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={handleClose}>
      <DialogContent
        className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-lg"
        showCloseButton={!orderSuccess}
      >
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            {orderSuccess ? (
              <>
                <PartyPopper className="size-5 text-primary" />
                {isBn ? 'অর্ডার সফল!' : 'Order Placed!'}
              </>
            ) : (
              <>
                <ShoppingBag className="size-5 text-primary" />
                {isBn ? 'চেকআউট' : 'Checkout'}
              </>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isBn ? 'অর্ডার সম্পন্ন করুন' : 'Complete your order'}
          </DialogDescription>
        </DialogHeader>

        {orderSuccess ? (
          <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Check className="size-10 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {isBn ? 'আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!' : 'Your order has been placed!'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {isBn ? 'অর্ডার আইডি:' : 'Order ID:'}{' '}
                <span className="font-mono font-semibold text-primary">
                  {orderId.slice(0, 8).toUpperCase()}
                </span>
              </p>
            </div>
            <div className="w-full rounded-lg bg-muted/50 p-4 text-left text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {isBn ? 'নাম' : 'Name'}
                  </span>
                  <span>{deliveryForm.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {isBn ? 'ফোন' : 'Phone'}
                  </span>
                  <span>{deliveryForm.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {isBn ? 'পেমেন্ট' : 'Payment'}
                  </span>
                  <span>
                    {paymentMethods.find((m) => m.value === paymentMethod)?.[isBn ? 'labelBn' : 'labelEn']}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>{isBn ? 'মোট' : 'Total'}</span>
                  <span className="text-primary">৳{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <a
                href={`https://wa.me/8801700000000?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                <Phone className="size-4" />
                {isBn ? 'WhatsApp-এ অর্ডার নিশ্চিত করুন' : 'Confirm on WhatsApp'}
              </a>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleClose(false)}
              >
                {isBn ? 'হোমে ফিরে যান' : 'Back to Home'}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 border-b px-6 py-3">
              {stepLabels.map((label, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                      step > idx + 1
                        ? 'bg-primary text-primary-foreground'
                        : step === idx + 1
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > idx + 1 ? (
                      <Check className="size-3.5" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      step === idx + 1
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {label}
                  </span>
                  {idx < stepLabels.length - 1 && (
                    <div className="mx-1 h-px w-6 bg-border" />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Step 1: Delivery Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkout-name" className="flex items-center gap-1.5">
                      <User className="size-3.5" />
                      {isBn ? 'নাম' : 'Full Name'}{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="checkout-name"
                      placeholder={isBn ? 'আপনার নাম লিখুন' : 'Enter your name'}
                      value={deliveryForm.name}
                      onChange={(e) =>
                        setDeliveryForm({ ...deliveryForm, name: e.target.value })
                      }
                      aria-invalid={!!formErrors.name}
                    />
                    {formErrors.name && (
                      <p className="text-xs text-destructive">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkout-phone" className="flex items-center gap-1.5">
                      <Phone className="size-3.5" />
                      {isBn ? 'ফোন নম্বর' : 'Phone Number'}{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="checkout-phone"
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={deliveryForm.phone}
                      onChange={(e) =>
                        setDeliveryForm({ ...deliveryForm, phone: e.target.value })
                      }
                      aria-invalid={!!formErrors.phone}
                    />
                    {formErrors.phone && (
                      <p className="text-xs text-destructive">{formErrors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkout-address" className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {isBn ? 'সম্পূর্ণ ঠিকানা' : 'Full Address'}{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="checkout-address"
                      placeholder={
                        isBn
                          ? 'বাড়ি নং, রোড, ব্লক, এলাকা'
                          : 'House, Road, Block, Area'
                      }
                      value={deliveryForm.address}
                      onChange={(e) =>
                        setDeliveryForm({ ...deliveryForm, address: e.target.value })
                      }
                      aria-invalid={!!formErrors.address}
                    />
                    {formErrors.address && (
                      <p className="text-xs text-destructive">{formErrors.address}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {isBn ? 'এলাকা' : 'Area'}{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={deliveryForm.area}
                      onValueChange={(value) =>
                        setDeliveryForm({ ...deliveryForm, area: value })
                      }
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={!!formErrors.area}
                      >
                        <SelectValue
                          placeholder={isBn ? 'এলাকা নির্বাচন করুন' : 'Select area'}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {DELIVERY_AREAS.map((area) => (
                          <SelectItem key={area.value} value={area.value}>
                            {isBn ? area.labelBn : area.labelEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.area && (
                      <p className="text-xs text-destructive">{formErrors.area}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkout-notes" className="flex items-center gap-1.5">
                      <MessageSquare className="size-3.5" />
                      {isBn ? 'নোট (ঐচ্ছিক)' : 'Notes (Optional)'}
                    </Label>
                    <Textarea
                      id="checkout-notes"
                      placeholder={
                        isBn
                          ? 'ডেলিভারি নির্দেশনা বা বিশেষ অনুরোধ'
                          : 'Delivery instructions or special requests'
                      }
                      value={deliveryForm.notes}
                      onChange={(e) =>
                        setDeliveryForm({ ...deliveryForm, notes: e.target.value })
                      }
                      className="min-h-12"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <div className="space-y-4">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="gap-3"
                  >
                    {paymentMethods.map((method) => {
                      const Icon = method.icon
                      return (
                        <label
                          key={method.value}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                            paymentMethod === method.value
                              ? 'border-primary bg-primary/5'
                              : 'hover:bg-accent/50'
                          }`}
                        >
                          <RadioGroupItem value={method.value} />
                          <Icon className={`size-5 ${method.color}`} />
                          <div className="flex-1">
                            <div className="font-medium">
                              {isBn ? method.labelBn : method.labelEn}
                            </div>
                            {method.value === 'cod' && (
                              <div className="text-xs text-muted-foreground">
                                {isBn
                                  ? 'ডেলিভারির সময় পেমেন্ট করুন'
                                  : 'Pay when you receive your order'}
                              </div>
                            )}
                            {method.value !== 'cod' && (
                              <div className="text-xs text-muted-foreground">
                                {isBn
                                  ? 'মোবাইল ব্যাংকিংয়ের মাধ্যমে পেমেন্ট'
                                  : 'Pay via mobile banking'}
                              </div>
                            )}
                          </div>
                          {method.value === 'cod' && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            >
                              {isBn ? 'জনপ্রিয়' : 'Popular'}
                            </Badge>
                          )}
                        </label>
                      )
                    })}
                  </RadioGroup>

                  {paymentMethod !== 'cod' && (
                    <div className="space-y-2">
                      <Label htmlFor="payment-phone" className="flex items-center gap-1.5">
                        <Phone className="size-3.5" />
                        {isBn
                          ? `${paymentMethods.find((m) => m.value === paymentMethod)?.labelBn} নম্বর`
                          : `${paymentMethods.find((m) => m.value === paymentMethod)?.labelEn} Number`}
                      </Label>
                      <Input
                        id="payment-phone"
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        aria-invalid={!!formErrors.paymentPhone}
                      />
                      {formErrors.paymentPhone && (
                        <p className="text-xs text-destructive">
                          {formErrors.paymentPhone}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {isBn
                          ? 'অর্ডার নিশ্চিত হলে পেমেন্ট নির্দেশনা পাবেন'
                          : 'You will receive payment instructions after order confirmation'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Order Summary */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* Delivery Info */}
                  <div className="rounded-lg border p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <MapPin className="size-4 text-primary" />
                      {isBn ? 'ডেলিভারি তথ্য' : 'Delivery Info'}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        {deliveryForm.name} • {deliveryForm.phone}
                      </p>
                      <p>{deliveryForm.address}</p>
                      <p>
                        {DELIVERY_AREAS.find((a) => a.value === deliveryForm.area)?.[isBn ? 'labelBn' : 'labelEn']}
                      </p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="rounded-lg border p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <CreditCard className="size-4 text-primary" />
                      {isBn ? 'পেমেন্ট' : 'Payment'}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {paymentMethods.find((m) => m.value === paymentMethod)?.[isBn ? 'labelBn' : 'labelEn']}
                      {paymentMethod !== 'cod' && paymentPhone && ` (${paymentPhone})`}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="rounded-lg border p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <ShoppingBag className="size-4 text-primary" />
                      {isBn ? 'অর্ডার আইটেম' : 'Order Items'}{' '}
                      <Badge variant="secondary" className="text-xs">
                        {cartItems.length}
                      </Badge>
                    </div>
                    <div className="max-h-48 space-y-2 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex-1">
                            <span>{isBn ? item.productNameBn : item.productNameEn}</span>
                            <span className="text-muted-foreground"> × {item.quantity}</span>
                          </div>
                          <span className="font-medium">
                            ৳{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div className="rounded-lg border p-3">
                    <Label className="flex items-center gap-1.5 text-sm mb-2">
                      <Tag className="size-3.5" />
                      {isBn ? 'কুপন কোড' : 'Coupon Code'}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder={isBn ? 'কুপন কোড লিখুন' : 'Enter coupon code'}
                        value={checkoutCoupon}
                        onChange={(e) => {
                          setCheckoutCoupon(e.target.value)
                          setCouponError('')
                        }}
                        disabled={couponApplied}
                        className="text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          if (!checkoutCoupon.trim()) return
                          setCouponLoading(true)
                          try {
                            const res = await fetch(`/api/coupons?code=${encodeURIComponent(checkoutCoupon.trim())}&totalAmount=${subtotal}`)
                            const data = await res.json()
                            if (data.valid) {
                              setCouponDiscount(data.discountAmount)
                              setCouponApplied(true)
                              toast({ title: isBn ? 'কুপন প্রয়োগ হয়েছে!' : 'Coupon applied!', description: isBn ? `৳${data.discountAmount} ছাড়` : `৳${data.discountAmount} discount` })
                            } else {
                              setCouponError(data.error || 'Invalid coupon')
                              setCouponDiscount(0)
                            }
                          } catch {
                            setCouponError(isBn ? 'কুপন যাচাই ব্যর্থ' : 'Coupon validation failed')
                          } finally {
                            setCouponLoading(false)
                          }
                        }}
                        disabled={couponLoading || couponApplied || !checkoutCoupon.trim()}
                        className="shrink-0"
                      >
                        {couponLoading ? <Loader2 className="size-3.5 animate-spin" /> : couponApplied ? '✓' : isBn ? 'প্রয়োগ' : 'Apply'}
                      </Button>
                    </div>
                    {couponError && <p className="text-xs text-destructive mt-1">{couponError}</p>}
                    {couponApplied && couponDiscount > 0 && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        {isBn ? `৳${couponDiscount} ছাড় প্রয়োগ হয়েছে` : `৳${couponDiscount} discount applied`}
                      </p>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {isBn ? 'উপমোট' : 'Subtotal'}
                        </span>
                        <span>৳{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
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
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {isBn ? 'সঞ্চয়' : 'Savings'}
                          </span>
                          <span className="text-green-600 dark:text-green-400">
                            -৳{savings.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {couponDiscount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {isBn ? 'কুপন ছাড়' : 'Coupon Discount'}
                          </span>
                          <span className="text-green-600 dark:text-green-400">
                            -৳{couponDiscount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>{isBn ? 'মোট' : 'Total'}</span>
                        <span className="text-primary">৳{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-2 border-t px-6 py-4">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack} className="gap-1.5">
                  <ArrowLeft className="size-4" />
                  {isBn ? 'পেছনে' : 'Back'}
                </Button>
              )}
              <div className="flex-1" />
              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  className="gap-1.5 bg-primary text-white hover:bg-primary/90"
                >
                  {isBn ? 'পরবর্তী' : 'Next'}
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                  className="gap-1.5 bg-primary text-white hover:bg-primary/90"
                >
                  {orderLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Check className="size-4" />
                  )}
                  {isBn ? 'অর্ডার নিশ্চিত করুন' : 'Confirm Order'}
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
