'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Phone,
  Zap,
  Wallet,
  Receipt,
  User,
  PartyPopper,
} from 'lucide-react'
import { useStore } from '@/store/use-store'
import { useToast } from '@/hooks/use-toast'

const SERVICE_CONFIG: Record<string, {
  nameBn: string
  nameEn: string
  emoji: string
  feeRate: number
  accountLabelBn: string
  accountLabelEn: string
  accountPlaceholder: string
  icon: typeof Phone
}> = {
  'bkash_cashout': {
    nameBn: 'বিকাশ ক্যাশ আউট',
    nameEn: 'bKash Cash Out',
    emoji: '💗',
    feeRate: 0.0185,
    accountLabelBn: 'বিকাশ নম্বর',
    accountLabelEn: 'bKash Number',
    accountPlaceholder: '01XXXXXXXXX',
    icon: Phone,
  },
  'nagad_cashout': {
    nameBn: 'নগদ ক্যাশ আউট',
    nameEn: 'Nagad Cash Out',
    emoji: '🟠',
    feeRate: 0.0145,
    accountLabelBn: 'নগদ নম্বর',
    accountLabelEn: 'Nagad Number',
    accountPlaceholder: '01XXXXXXXXX',
    icon: Phone,
  },
  'dpdc_electric': {
    nameBn: 'DPDC বিদ্যুৎ বিল',
    nameEn: 'DPDC Electric Bill',
    emoji: '⚡',
    feeRate: 0,
    accountLabelBn: 'হিসাব নম্বর',
    accountLabelEn: 'Account Number',
    accountPlaceholder: 'DPDC-XXXXXXXX',
    icon: Zap,
  },
}

interface FormErrors {
  accountNumber?: string
  amount?: string
  customerName?: string
}

export function BillPaymentDialog() {
  const {
    isBillPaymentOpen,
    setIsBillPaymentOpen,
    billPaymentType,
    setBillPaymentType,
    language,
  } = useStore()

  const isBn = language === 'bn'
  const { toast } = useToast()

  const [step, setStep] = useState(1)
  const [accountNumber, setAccountNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentId, setPaymentId] = useState('')

  const config = useMemo(
    () => SERVICE_CONFIG[billPaymentType || 'bkash_cashout'],
    [billPaymentType]
  )

  const fee = useMemo(() => {
    const amt = parseFloat(amount) || 0
    return Math.round(amt * config.feeRate * 100) / 100
  }, [amount, config.feeRate])

  const total = useMemo(() => {
    const amt = parseFloat(amount) || 0
    return Math.round((amt + fee) * 100) / 100
  }, [amount, fee])

  const validateStep1 = (): boolean => {
    const errors: FormErrors = {}
    if (!accountNumber.trim()) {
      errors.accountNumber = isBn ? 'অ্যাকাউন্ট নম্বর আবশ্যক' : 'Account number is required'
    } else if (billPaymentType !== 'dpdc_electric' && !/^01[3-9]\d{8}$/.test(accountNumber.trim())) {
      errors.accountNumber = isBn ? 'সঠিক ফোন নম্বর দিন' : 'Enter a valid phone number'
    } else if (billPaymentType === 'dpdc_electric' && accountNumber.trim().length < 6) {
      errors.accountNumber = isBn ? 'সঠিক হিসাব নম্বর দিন' : 'Enter a valid account number'
    }
    if (!customerName.trim()) {
      errors.customerName = isBn ? 'নাম আবশ্যক' : 'Name is required'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep2 = (): boolean => {
    const errors: FormErrors = {}
    const amt = parseFloat(amount)
    if (!amount || isNaN(amt) || amt <= 0) {
      errors.amount = isBn ? 'সঠিক পরিমাণ দিন' : 'Enter a valid amount'
    } else if (amt < 50) {
      errors.amount = isBn ? 'সর্বনিম্ন ৳৫০' : 'Minimum ৳50'
    } else if (amt > 25000) {
      errors.amount = isBn ? 'সর্বোচ্চ ৳২৫,০০০' : 'Maximum ৳25,000'
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

  const handleConfirm = async () => {
    setPaymentLoading(true)
    try {
      const amt = parseFloat(amount) || 0

      const res = await fetch('/api/bill-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: billPaymentType,
          providerNameBn: config.nameBn,
          providerNameEn: config.nameEn,
          amount: amt,
          fee,
          customerAccount: accountNumber.trim(),
          customerName: customerName.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({
          title: isBn ? 'পেমেন্ট ব্যর্থ' : 'Payment failed',
          description: data.error || 'Something went wrong',
          variant: 'destructive',
        })
        return
      }

      setPaymentId(data.payment?.id || '')
      setPaymentSuccess(true)
      toast({
        title: isBn ? 'পেমেন্ট সফল!' : 'Payment successful!',
        description: isBn
          ? `${config.nameBn} সফলভাবে সম্পন্ন হয়েছে`
          : `${config.nameEn} completed successfully`,
      })
    } catch {
      toast({
        title: isBn ? 'পেমেন্ট ব্যর্থ' : 'Payment failed',
        description: isBn
          ? 'নেটওয়ার্ক সমস্যা হয়েছে'
          : 'Network error occurred',
        variant: 'destructive',
      })
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleClose = (open: boolean) => {
    setIsBillPaymentOpen(open)
    if (!open) {
      setTimeout(() => {
        setStep(1)
        setAccountNumber('')
        setAmount('')
        setCustomerName('')
        setFormErrors({})
        setPaymentSuccess(false)
        setPaymentId('')
        setPaymentLoading(false)
        setBillPaymentType(null)
      }, 300)
    }
  }

  const stepLabels = [
    isBn ? 'অ্যাকাউন্ট' : 'Account',
    isBn ? 'পরিমাণ' : 'Amount',
    isBn ? 'নিশ্চিতকরণ' : 'Confirm',
  ]

  const ServiceIcon = config.icon

  return (
    <Dialog open={isBillPaymentOpen} onOpenChange={handleClose}>
      <DialogContent
        className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-md"
        showCloseButton={!paymentSuccess}
      >
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            {paymentSuccess ? (
              <>
                <PartyPopper className="size-5 text-green-600" />
                {isBn ? 'পেমেন্ট সফল!' : 'Payment Successful!'}
              </>
            ) : (
              <>
                <span className="text-xl">{config.emoji}</span>
                {isBn ? config.nameBn : config.nameEn}
              </>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isBn ? 'বিল পেমেন্ট সম্পন্ন করুন' : 'Complete your bill payment'}
          </DialogDescription>
        </DialogHeader>

        {paymentSuccess ? (
          <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
            >
              <Check className="size-10 text-green-600 dark:text-green-400" />
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold">
                {isBn ? 'পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!' : 'Payment completed successfully!'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {isBn ? 'লেনদেন আইডি:' : 'Transaction ID:'}{' '}
                <span className="font-mono font-semibold text-primary">
                  {paymentId.slice(0, 8).toUpperCase()}
                </span>
              </p>
            </div>

            <div className="w-full rounded-lg bg-muted/50 p-4 text-left text-sm">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isBn ? 'সেবা' : 'Service'}</span>
                  <span className="font-medium">{isBn ? config.nameBn : config.nameEn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isBn ? 'অ্যাকাউন্ট' : 'Account'}</span>
                  <span>{accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isBn ? 'পরিমাণ' : 'Amount'}</span>
                  <span>৳{parseFloat(amount).toFixed(2)}</span>
                </div>
                {fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isBn ? 'ফি' : 'Fee'}</span>
                    <span>৳{fee.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>{isBn ? 'মোট' : 'Total'}</span>
                  <span className="text-primary">৳{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleClose(false)}
            >
              {isBn ? 'হোমে ফিরে যান' : 'Back to Home'}
            </Button>
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
              <AnimatePresence mode="wait">
                {/* Step 1: Account Info */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                      <span className="text-3xl">{config.emoji}</span>
                      <div>
                        <p className="font-semibold">{isBn ? config.nameBn : config.nameEn}</p>
                        <p className="text-xs text-muted-foreground">
                          {!isBn ? config.nameBn : config.nameEn}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bp-customer-name" className="flex items-center gap-1.5">
                        <User className="size-3.5" />
                        {isBn ? 'আপনার নাম' : 'Your Name'}{' '}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="bp-customer-name"
                        placeholder={isBn ? 'আপনার নাম লিখুন' : 'Enter your name'}
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value)
                          setFormErrors((prev) => ({ ...prev, customerName: undefined }))
                        }}
                        aria-invalid={!!formErrors.customerName}
                      />
                      {formErrors.customerName && (
                        <p className="text-xs text-destructive">{formErrors.customerName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bp-account" className="flex items-center gap-1.5">
                        <ServiceIcon className="size-3.5" />
                        {isBn ? config.accountLabelBn : config.accountLabelEn}{' '}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="bp-account"
                        type="tel"
                        placeholder={config.accountPlaceholder}
                        value={accountNumber}
                        onChange={(e) => {
                          setAccountNumber(e.target.value)
                          setFormErrors((prev) => ({ ...prev, accountNumber: undefined }))
                        }}
                        aria-invalid={!!formErrors.accountNumber}
                      />
                      {formErrors.accountNumber && (
                        <p className="text-xs text-destructive">{formErrors.accountNumber}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {billPaymentType === 'dpdc_electric'
                          ? isBn
                            ? 'আপনার DPDC হিসাব নম্বর দিন'
                            : 'Enter your DPDC account number'
                          : isBn
                            ? 'যে নম্বর থেকে ক্যাশ আউট করবেন'
                            : 'The number you want to cash out from'}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Amount */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="bp-amount" className="flex items-center gap-1.5">
                        <Wallet className="size-3.5" />
                        {isBn ? 'পরিমাণ (৳)' : 'Amount (৳)'}{' '}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                          ৳
                        </span>
                        <Input
                          id="bp-amount"
                          type="number"
                          inputMode="numeric"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => {
                            setAmount(e.target.value)
                            setFormErrors((prev) => ({ ...prev, amount: undefined }))
                          }}
                          className="pl-8 text-lg font-semibold"
                          aria-invalid={!!formErrors.amount}
                        />
                      </div>
                      {formErrors.amount && (
                        <p className="text-xs text-destructive">{formErrors.amount}</p>
                      )}

                      {/* Quick Amount Buttons */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {[100, 500, 1000, 2000, 5000].map((quickAmount) => (
                          <Button
                            key={quickAmount}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              setAmount(quickAmount.toString())
                              setFormErrors((prev) => ({ ...prev, amount: undefined }))
                            }}
                          >
                            ৳{quickAmount.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Fee Preview */}
                    <div className="rounded-lg border p-4 space-y-2 bg-muted/30">
                      <div className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Receipt className="size-4 text-primary" />
                        {isBn ? 'ফি বিবরণ' : 'Fee Breakdown'}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{isBn ? 'পরিমাণ' : 'Amount'}</span>
                        <span>৳{(parseFloat(amount) || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {isBn ? 'ফি' : 'Fee'}
                          {config.feeRate > 0 && (
                            <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">
                              {config.feeRate === 0.0185 ? '1.85%' : config.feeRate === 0.0145 ? '1.45%' : ''}
                            </Badge>
                          )}
                        </span>
                        <span className={fee === 0 ? 'text-green-600 dark:text-green-400' : ''}>
                          {fee === 0 ? (isBn ? 'ফ্রি' : 'Free') : `৳${fee.toFixed(2)}`}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>{isBn ? 'মোট' : 'Total'}</span>
                        <span className="text-primary">৳{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Service Info */}
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <span className="text-xl">{config.emoji}</span>
                        {isBn ? 'সেবা তথ্য' : 'Service Info'}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          <span className="text-foreground font-medium">{isBn ? config.nameBn : config.nameEn}</span>
                          <span className="ml-2 text-xs">({!isBn ? config.nameBn : config.nameEn})</span>
                        </p>
                      </div>
                    </div>

                    {/* Account Info */}
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <User className="size-4 text-primary" />
                        {isBn ? 'গ্রাহক তথ্য' : 'Customer Info'}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{isBn ? 'নাম' : 'Name'}</span>
                          <span>{customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{isBn ? 'অ্যাকাউন্ট' : 'Account'}</span>
                          <span className="font-mono">{accountNumber}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <Receipt className="size-4 text-primary" />
                        {isBn ? 'পেমেন্ট সারসংক্ষেপ' : 'Payment Summary'}
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{isBn ? 'পরিমাণ' : 'Amount'}</span>
                          <span>৳{(parseFloat(amount) || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {isBn ? 'সার্ভিস ফি' : 'Service Fee'}
                          </span>
                          <span className={fee === 0 ? 'text-green-600 dark:text-green-400' : ''}>
                            {fee === 0 ? (isBn ? 'ফ্রি' : 'Free') : `৳${fee.toFixed(2)}`}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-base">
                          <span>{isBn ? 'মোট পরিশোধ' : 'Total Payable'}</span>
                          <span className="text-primary">৳{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                      {isBn
                        ? '"নিশ্চিত করুন" বোতামে ক্লিক করলে পেমেন্ট প্রক্রিয়া শুরু হবে'
                        : 'Clicking "Confirm" will start the payment process'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
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
                  onClick={handleConfirm}
                  disabled={paymentLoading}
                  className="gap-1.5 bg-primary text-white hover:bg-primary/90"
                >
                  {paymentLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Check className="size-4" />
                  )}
                  {isBn ? 'নিশ্চিত করুন' : 'Confirm'}
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
