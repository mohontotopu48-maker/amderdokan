'use client'

import { useState, useEffect, useCallback } from 'react'
import { useStore } from '@/store/use-store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  Tag,
  Star,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Check,
} from 'lucide-react'
import type { ChartConfig } from '@/components/ui/chart'

// ─── Types ───────────────────────────────────────────────────────────────────

interface StatsData {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  ordersByStatus: Record<string, number>
  paymentsByStatus: Record<string, number>
  recentOrders: Array<{
    id: string
    totalAmount: number
    finalAmount: number
    orderStatus: string
    paymentStatus: string
    createdAt: string
    user: { name: string; phone: string }
    items: Array<{ nameBn: string; nameEn: string; quantity: number; price: number }>
  }>
  categoryDistribution: Array<{
    id: string
    nameBn: string
    nameEn: string
    productCount: number
  }>
}

interface ProductItem {
  id: string
  nameBn: string
  nameEn: string
  price: number
  originalPrice: number | null
  stock: number
  discount: number
  isActive: boolean
  category: { nameBn: string; nameEn: string }
  rating: number
  reviewCount: number
}

interface OrderItem {
  id: string
  finalAmount: number
  totalAmount: number
  orderStatus: string
  paymentStatus: string
  paymentMethod: string
  deliveryAddress: string
  deliveryPhone: string
  createdAt: string
  user: { name: string; phone: string }
  items: Array<{
    nameBn: string
    nameEn: string
    quantity: number
    price: number
    unit: string
  }>
}

interface CouponItem {
  id: string
  code: string
  discount: number
  discountType: string
  minOrder: number
  maxDiscount: number | null
  usageLimit: number | null
  usedCount: number
  isActive: boolean
  expiresAt: string | null
  createdAt: string
}

interface ReviewItem {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: { name: string }
  product: { nameBn: string; nameEn: string }
}

interface RevenueData {
  date: string
  revenue: number
  orders: number
}

// ─── Chart configs ───────────────────────────────────────────────────────────

const revenueChartConfig: ChartConfig = {
  revenue: {
    label: 'আয় / Revenue',
    color: '#16a34a',
  },
}

const orderPieConfig: ChartConfig = {
  pending: { label: 'পেন্ডিং', color: '#f97316' },
  confirmed: { label: 'নিশ্চিত', color: '#22c55e' },
  processing: { label: 'প্রসেসিং', color: '#eab308' },
  shipped: { label: 'শিপড', color: '#06b6d4' },
  delivered: { label: 'ডেলিভার্ড', color: '#16a34a' },
  cancelled: { label: 'বাতিল', color: '#ef4444' },
}

const PIE_COLORS = ['#f97316', '#22c55e', '#eab308', '#06b6d4', '#16a34a', '#ef4444']

// ─── Helper ──────────────────────────────────────────────────────────────────

function formatTaka(amount: number) {
  return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    case 'confirmed':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'processing':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'shipped':
      return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
    case 'delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'cancelled':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  }
}

function getStatusLabel(status: string, isBn: boolean) {
  const labels: Record<string, { bn: string; en: string }> = {
    pending: { bn: 'পেন্ডিং', en: 'Pending' },
    confirmed: { bn: 'নিশ্চিত', en: 'Confirmed' },
    processing: { bn: 'প্রসেসিং', en: 'Processing' },
    shipped: { bn: 'শিপড', en: 'Shipped' },
    delivered: { bn: 'ডেলিভার্ড', en: 'Delivered' },
    cancelled: { bn: 'বাতিল', en: 'Cancelled' },
  }
  const label = labels[status]
  return label ? (isBn ? label.bn : label.en) : status
}

// ─── Loading skeleton ────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="size-8 animate-spin text-green-600" />
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function AdminDashboard() {
  const { language, setIsAdminMode } = useStore()
  const isBn = language === 'bn'

  // ─── Stats ───────────────────────────────────────────────────────────────
  const [stats, setStats] = useState<StatsData | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const res = await fetch('/api/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  // ─── Revenue ─────────────────────────────────────────────────────────────
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [revenueLoading, setRevenueLoading] = useState(true)

  const fetchRevenue = useCallback(async () => {
    setRevenueLoading(true)
    try {
      const res = await fetch('/api/admin/revenue')
      if (res.ok) {
        const data = await res.json()
        setRevenueData(data.daily || [])
      }
    } catch (err) {
      console.error('Failed to fetch revenue:', err)
    } finally {
      setRevenueLoading(false)
    }
  }, [])

  // ─── Products ────────────────────────────────────────────────────────────
  const [products, setProducts] = useState<ProductItem[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productSearch, setProductSearch] = useState('')
  const [productPage, setProductPage] = useState(1)
  const [productTotal, setProductTotal] = useState(0)

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(productPage),
        limit: '10',
        search: productSearch,
      })
      const res = await fetch(`/api/products?${params}`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
        setProductTotal(data.pagination?.total || 0)
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setProductsLoading(false)
    }
  }, [productPage, productSearch])

  // ─── Orders ──────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [orderPage, setOrderPage] = useState(1)
  const [orderTotal, setOrderTotal] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null)

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(orderPage),
        limit: '10',
      })
      if (orderStatusFilter !== 'all') {
        params.set('status', orderStatusFilter)
      }
      const res = await fetch(`/api/orders?${params}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
        setOrderTotal(data.pagination?.total || 0)
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setOrdersLoading(false)
    }
  }, [orderPage, orderStatusFilter])

  // ─── Coupons ─────────────────────────────────────────────────────────────
  const [coupons, setCoupons] = useState<CouponItem[]>([])
  const [couponsLoading, setCouponsLoading] = useState(true)

  const fetchCoupons = useCallback(async () => {
    setCouponsLoading(true)
    try {
      const res = await fetch('/api/admin/coupons')
      if (res.ok) {
        const data = await res.json()
        setCoupons(data.coupons || [])
      }
    } catch (err) {
      console.error('Failed to fetch coupons:', err)
    } finally {
      setCouponsLoading(false)
    }
  }, [])

  // ─── Reviews ─────────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewPage, setReviewPage] = useState(1)
  const [reviewTotal, setReviewTotal] = useState(0)

  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(reviewPage),
        limit: '10',
      })
      const res = await fetch(`/api/admin/reviews?${params}`)
      if (res.ok) {
        const data = await res.json()
        setReviews(data.reviews || [])
        setReviewTotal(data.pagination?.total || 0)
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
    } finally {
      setReviewsLoading(false)
    }
  }, [reviewPage])

  // ─── Product Dialog ──────────────────────────────────────────────────────
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null)
  const [productForm, setProductForm] = useState({
    nameBn: '',
    nameEn: '',
    price: '',
    stock: '',
    categoryId: '',
    unit: 'kg',
    discount: '0',
    descriptionBn: '',
    descriptionEn: '',
  })
  const [productFormLoading, setProductFormLoading] = useState(false)

  // ─── Coupon Dialog ───────────────────────────────────────────────────────
  const [couponDialogOpen, setCouponDialogOpen] = useState(false)
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount: '',
    discountType: 'percentage',
    minOrder: '0',
    maxDiscount: '',
    usageLimit: '',
    expiresAt: '',
  })
  const [couponFormLoading, setCouponFormLoading] = useState(false)

  // ─── Inventory ───────────────────────────────────────────────────────────
  const [inventoryProducts, setInventoryProducts] = useState<ProductItem[]>([])
  const [inventoryLoading, setInventoryLoading] = useState(true)
  const [stockUpdateId, setStockUpdateId] = useState<string | null>(null)
  const [stockUpdateValue, setStockUpdateValue] = useState('')

  const fetchInventory = useCallback(async () => {
    setInventoryLoading(true)
    try {
      const params = new URLSearchParams({ limit: '100', sort: 'newest' })
      const res = await fetch(`/api/products?${params}`)
      if (res.ok) {
        const data = await res.json()
        setInventoryProducts(data.products || [])
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err)
    } finally {
      setInventoryLoading(false)
    }
  }, [])

  // ─── Effects ─────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchStats()
    fetchRevenue()
  }, [fetchStats, fetchRevenue])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  useEffect(() => {
    fetchCoupons()
  }, [fetchCoupons])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  // ─── Product Actions ─────────────────────────────────────────────────────

  const openAddProduct = () => {
    setEditingProduct(null)
    setProductForm({
      nameBn: '',
      nameEn: '',
      price: '',
      stock: '',
      categoryId: '',
      unit: 'kg',
      discount: '0',
      descriptionBn: '',
      descriptionEn: '',
    })
    setProductDialogOpen(true)
  }

  const openEditProduct = (product: ProductItem) => {
    setEditingProduct(product)
    setProductForm({
      nameBn: product.nameBn,
      nameEn: product.nameEn,
      price: String(product.price),
      stock: String(product.stock),
      categoryId: '',
      unit: 'kg',
      discount: String(product.discount),
      descriptionBn: '',
      descriptionEn: '',
    })
    setProductDialogOpen(true)
  }

  const handleSaveProduct = async () => {
    setProductFormLoading(true)
    try {
      const slug = productForm.nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const body = {
        nameBn: productForm.nameBn,
        nameEn: productForm.nameEn,
        slug: editingProduct ? undefined : slug,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock, 10),
        discount: parseInt(productForm.discount, 10),
        unit: productForm.unit,
        categoryId: productForm.categoryId || undefined,
        descriptionBn: productForm.descriptionBn || null,
        descriptionEn: productForm.descriptionEn || null,
      }

      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error('Failed to update product')
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error('Failed to create product')
      }

      setProductDialogOpen(false)
      fetchProducts()
      fetchStats()
      fetchInventory()
    } catch (err) {
      console.error('Error saving product:', err)
    } finally {
      setProductFormLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm(isBn ? 'আপনি কি এই পণ্য মুছে ফেলতে চান?' : 'Are you sure you want to delete this product?')) return
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete product')
      fetchProducts()
      fetchStats()
      fetchInventory()
    } catch (err) {
      console.error('Error deleting product:', err)
    }
  }

  // ─── Order Actions ───────────────────────────────────────────────────────

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update order status')
      fetchOrders()
      fetchStats()
    } catch (err) {
      console.error('Error updating order status:', err)
    }
  }

  // ─── Coupon Actions ──────────────────────────────────────────────────────

  const handleCreateCoupon = async () => {
    setCouponFormLoading(true)
    try {
      const body = {
        code: couponForm.code.toUpperCase(),
        discount: parseInt(couponForm.discount, 10),
        discountType: couponForm.discountType,
        minOrder: parseFloat(couponForm.minOrder) || 0,
        maxDiscount: couponForm.maxDiscount ? parseFloat(couponForm.maxDiscount) : null,
        usageLimit: couponForm.usageLimit ? parseInt(couponForm.usageLimit, 10) : null,
        expiresAt: couponForm.expiresAt || null,
      }

      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create coupon')
      }

      setCouponDialogOpen(false)
      setCouponForm({
        code: '',
        discount: '',
        discountType: 'percentage',
        minOrder: '0',
        maxDiscount: '',
        usageLimit: '',
        expiresAt: '',
      })
      fetchCoupons()
    } catch (err) {
      console.error('Error creating coupon:', err)
    } finally {
      setCouponFormLoading(false)
    }
  }

  const handleToggleCoupon = async (couponId: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      if (!res.ok) throw new Error('Failed to toggle coupon')
      fetchCoupons()
    } catch (err) {
      console.error('Error toggling coupon:', err)
    }
  }

  // ─── Review Actions ──────────────────────────────────────────────────────

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm(isBn ? 'আপনি কি এই রিভিউ মুছে ফেলতে চান?' : 'Are you sure you want to delete this review?')) return
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete review')
      fetchReviews()
    } catch (err) {
      console.error('Error deleting review:', err)
    }
  }

  // ─── Stock Update ────────────────────────────────────────────────────────

  const handleQuickStockUpdate = async (productId: string) => {
    const newStock = parseInt(stockUpdateValue, 10)
    if (isNaN(newStock) || newStock < 0) return
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      })
      if (!res.ok) throw new Error('Failed to update stock')
      setStockUpdateId(null)
      setStockUpdateValue('')
      fetchInventory()
    } catch (err) {
      console.error('Error updating stock:', err)
    }
  }

  // ─── Derived Data ────────────────────────────────────────────────────────

  const lowStockProducts = inventoryProducts.filter((p) => p.stock < 10)
  const categoryStockSummary = inventoryProducts.reduce(
    (acc, p) => {
      const cat = p.category?.nameBn || 'অন্যান্য'
      if (!acc[cat]) acc[cat] = { total: 0, inStock: 0 }
      acc[cat].total += 1
      acc[cat].inStock += p.stock
      return acc
    },
    {} as Record<string, { total: number; inStock: number }>
  )

  // Review rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rev) => rev.rating === r).length,
  }))
  const maxRatingCount = Math.max(...ratingDistribution.map((r) => r.count), 1)

  // Pie chart data for order status
  const orderStatusData = stats?.ordersByStatus
    ? Object.entries(stats.ordersByStatus).map(([status, count], idx) => ({
        name: getStatusLabel(status, isBn),
        value: count,
        color: PIE_COLORS[idx % PIE_COLORS.length],
      }))
    : []

  const productTotalPages = Math.ceil(productTotal / 10)
  const orderTotalPages = Math.ceil(orderTotal / 10)
  const reviewTotalPages = Math.ceil(reviewTotal / 10)

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-card/80 backdrop-blur-lg border-b border-green-100 dark:border-green-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                {isBn ? 'আমাদের বাজার' : 'Amar Bazar'}
              </h1>
              <p className="text-xs text-muted-foreground">{isBn ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdminMode(false)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 border-red-200 dark:border-red-800"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline ml-1">{isBn ? 'লগ আউট' : 'Logout'}</span>
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          {/* Tabs - scrollable on mobile */}
          <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-green-50/50 dark:bg-green-950/20 p-1.5 rounded-xl">
            <TabsTrigger value="overview" className="flex-1 min-w-0 data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm">
              <LayoutDashboard className="size-4 shrink-0" />
              <span className="truncate">{isBn ? 'ড্যাশবোর্ড' : 'Overview'}</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex-1 min-w-0 data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm">
              <Package className="size-4 shrink-0" />
              <span className="truncate">{isBn ? 'পণ্য' : 'Products'}</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex-1 min-w-0 data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm">
              <ShoppingCart className="size-4 shrink-0" />
              <span className="truncate">{isBn ? 'অর্ডার' : 'Orders'}</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex-1 min-w-0 data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm">
              <Warehouse className="size-4 shrink-0" />
              <span className="truncate">{isBn ? 'ইনভেন্টরি' : 'Inventory'}</span>
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex-1 min-w-0 data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm">
              <Tag className="size-4 shrink-0" />
              <span className="truncate">{isBn ? 'কুপন' : 'Coupons'}</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 min-w-0 data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm">
              <Star className="size-4 shrink-0" />
              <span className="truncate">{isBn ? 'রিভিউ' : 'Reviews'}</span>
            </TabsTrigger>
          </TabsList>

          {/* ═══════════ TAB 1: Overview ═══════════ */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-green-200/50 dark:border-green-800/30 bg-gradient-to-br from-white to-green-50/50 dark:from-card dark:to-green-950/10">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{isBn ? 'মোট আয়' : 'Total Revenue'}</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400 mt-1">
                        {statsLoading ? '...' : formatTaka(stats?.totalRevenue || 0)}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <DollarSign className="size-5 sm:size-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200/50 dark:border-orange-800/30 bg-gradient-to-br from-white to-orange-50/50 dark:from-card dark:to-orange-950/10">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{isBn ? 'মোট অর্ডার' : 'Total Orders'}</p>
                      <p className="text-xl sm:text-2xl font-bold text-orange-700 dark:text-orange-400 mt-1">
                        {statsLoading ? '...' : (stats?.totalOrders || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="size-5 sm:size-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200/50 dark:border-emerald-800/30 bg-gradient-to-br from-white to-emerald-50/50 dark:from-card dark:to-emerald-950/10">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{isBn ? 'মোট পণ্য' : 'Total Products'}</p>
                      <p className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                        {statsLoading ? '...' : (stats?.totalProducts || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                      <Package className="size-5 sm:size-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200/50 dark:border-amber-800/30 bg-gradient-to-br from-white to-amber-50/50 dark:from-card dark:to-amber-950/10">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{isBn ? 'মোট গ্রাহক' : 'Total Customers'}</p>
                      <p className="text-xl sm:text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1">
                        {statsLoading ? '...' : (stats?.totalUsers || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                      <Users className="size-5 sm:size-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <Card className="lg:col-span-2 border-green-200/50 dark:border-green-800/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base sm:text-lg">{isBn ? 'আয়ের চার্ট' : 'Revenue Chart'}</CardTitle>
                      <CardDescription>{isBn ? 'শেষ ৭ দিন' : 'Last 7 Days'}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => { fetchRevenue(); fetchStats() }}>
                      <RefreshCw className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {revenueLoading ? (
                    <LoadingSkeleton />
                  ) : (
                    <ChartContainer config={revenueChartConfig} className="h-[250px] sm:h-[300px] w-full">
                      <BarChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>

              {/* Order Status Pie */}
              <Card className="border-orange-200/50 dark:border-orange-800/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg">{isBn ? 'অর্ডার স্ট্যাটাস' : 'Order Status'}</CardTitle>
                  <CardDescription>{isBn ? 'স্ট্যাটাস অনুযায়ী' : 'By Status'}</CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <LoadingSkeleton />
                  ) : orderStatusData.length > 0 ? (
                    <ChartContainer config={orderPieConfig} className="h-[220px] sm:h-[260px] w-full">
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">
                      {isBn ? 'কোনো অর্ডার নেই' : 'No orders yet'}
                    </div>
                  )}
                  {/* Status legend */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {orderStatusData.map((entry) => (
                      <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
                        <span className="text-muted-foreground">{entry.name} ({entry.value})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="border-green-200/50 dark:border-green-800/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">
                  {isBn ? 'সাম্প্রতিক অর্ডার' : 'Recent Orders'}
                </CardTitle>
                <CardDescription>{isBn ? 'সর্বশেষ ৫টি অর্ডার' : 'Last 5 orders'}</CardDescription>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">{isBn ? 'অর্ডার আইডি' : 'Order ID'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'গ্রাহক' : 'Customer'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'পরিমাণ' : 'Amount'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'তারিখ' : 'Date'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats?.recentOrders?.length ? (
                          stats.recentOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="text-xs font-mono">
                                {order.id.slice(-8).toUpperCase()}
                              </TableCell>
                              <TableCell className="text-xs">
                                {order.user?.name || 'N/A'}
                              </TableCell>
                              <TableCell className="text-xs font-medium">
                                {formatTaka(order.finalAmount)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className={`text-[10px] px-1.5 py-0.5 ${getStatusColor(order.orderStatus)}`}>
                                  {getStatusLabel(order.orderStatus, isBn)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                              {isBn ? 'কোনো অর্ডার পাওয়া যায়নি' : 'No orders found'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════ TAB 2: Products ═══════════ */}
          <TabsContent value="products" className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder={isBn ? 'পণ্য খুঁজুন...' : 'Search products...'}
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value)
                      setProductPage(1)
                    }}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
              </div>
              <Button
                onClick={openAddProduct}
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
              >
                <Plus className="size-4" />
                {isBn ? 'নতুন পণ্য' : 'Add Product'}
              </Button>
            </div>

            {/* Products Count */}
            <div className="text-sm text-muted-foreground">
              {isBn ? `মোট পণ্য: ${productTotal}` : `Total products: ${productTotal}`}
            </div>

            {/* Products Table */}
            <Card className="border-green-200/50 dark:border-green-800/30">
              <CardContent className="p-0">
                {productsLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">{isBn ? 'নাম' : 'Name'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'ক্যাটাগরি' : 'Category'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'দাম' : 'Price'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'স্টক' : 'Stock'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'কাজ' : 'Actions'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.length > 0 ? (
                          products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="text-xs max-w-[150px]">
                                <div className="font-medium truncate">{isBn ? product.nameBn : product.nameEn}</div>
                              </TableCell>
                              <TableCell className="text-xs">
                                {isBn ? product.category?.nameBn : product.category?.nameEn}
                              </TableCell>
                              <TableCell className="text-xs">
                                <span className="font-medium">{formatTaka(product.price)}</span>
                                {product.discount > 0 && (
                                  <span className="ml-1 text-orange-600 text-[10px]">-{product.discount}%</span>
                                )}
                              </TableCell>
                              <TableCell className="text-xs">
                                <span className={product.stock < 10 ? 'text-red-600 font-medium' : ''}>
                                  {product.stock}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={
                                    product.isActive
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px]'
                                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 text-[10px]'
                                  }
                                >
                                  {product.isActive
                                    ? isBn ? 'সক্রিয়' : 'Active'
                                    : isBn ? 'নিষ্ক্রিয়' : 'Inactive'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    onClick={() => openEditProduct(product)}
                                  >
                                    <Edit className="size-3.5 text-green-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    <Trash2 className="size-3.5 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              {isBn ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {productTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={productPage <= 1}
                  onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {productPage} / {productTotalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={productPage >= productTotalPages}
                  onClick={() => setProductPage((p) => p + 1)}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}

            {/* Product Dialog */}
            <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct
                      ? isBn ? 'পণ্য সম্পাদনা' : 'Edit Product'
                      : isBn ? 'নতুন পণ্য যোগ করুন' : 'Add New Product'}
                  </DialogTitle>
                  <DialogDescription>
                    {isBn ? 'পণ্যের তথ্য পূরণ করুন' : 'Fill in the product details'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">{isBn ? 'নাম (বাংলা)' : 'Name (Bangla)'}</label>
                      <Input
                        value={productForm.nameBn}
                        onChange={(e) => setProductForm({ ...productForm, nameBn: e.target.value })}
                        placeholder="পণ্যের নাম"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">{isBn ? 'নাম (English)' : 'Name (English)'}</label>
                      <Input
                        value={productForm.nameEn}
                        onChange={(e) => setProductForm({ ...productForm, nameEn: e.target.value })}
                        placeholder="Product name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">{isBn ? 'দাম (৳)' : 'Price (৳)'}</label>
                      <Input
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">{isBn ? 'স্টক' : 'Stock'}</label>
                      <Input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">{isBn ? 'ডিসকাউন্ট %' : 'Discount %'}</label>
                      <Input
                        type="number"
                        value={productForm.discount}
                        onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">{isBn ? 'বিবরণ (বাংলা)' : 'Description (Bangla)'}</label>
                    <Textarea
                      value={productForm.descriptionBn}
                      onChange={(e) => setProductForm({ ...productForm, descriptionBn: e.target.value })}
                      placeholder="পণ্যের বিবরণ..."
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setProductDialogOpen(false)}
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleSaveProduct}
                    disabled={productFormLoading || !productForm.nameBn || !productForm.price}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {productFormLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Check className="size-4" />
                    )}
                    {editingProduct
                      ? isBn ? 'আপডেট' : 'Update'
                      : isBn ? 'যোগ করুন' : 'Add'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* ═══════════ TAB 3: Orders ═══════════ */}
          <TabsContent value="orders" className="space-y-4">
            {/* Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <Select value={orderStatusFilter} onValueChange={(val) => { setOrderStatusFilter(val); setOrderPage(1) }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={isBn ? 'স্ট্যাটাস ফিল্টার' : 'Filter Status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isBn ? 'সব' : 'All'}</SelectItem>
                  <SelectItem value="pending">{isBn ? 'পেন্ডিং' : 'Pending'}</SelectItem>
                  <SelectItem value="confirmed">{isBn ? 'নিশ্চিত' : 'Confirmed'}</SelectItem>
                  <SelectItem value="processing">{isBn ? 'প্রসেসিং' : 'Processing'}</SelectItem>
                  <SelectItem value="shipped">{isBn ? 'শিপড' : 'Shipped'}</SelectItem>
                  <SelectItem value="delivered">{isBn ? 'ডেলিভার্ড' : 'Delivered'}</SelectItem>
                  <SelectItem value="cancelled">{isBn ? 'বাতিল' : 'Cancelled'}</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                {isBn ? `মোট: ${orderTotal}` : `Total: ${orderTotal}`}
              </div>
            </div>

            {/* Orders Table */}
            <Card className="border-orange-200/50 dark:border-orange-800/30">
              <CardContent className="p-0">
                {ordersLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">{isBn ? 'অর্ডার আইডি' : 'Order ID'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'গ্রাহক' : 'Customer'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'আইটেম' : 'Items'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'মোট' : 'Total'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'তারিখ' : 'Date'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'কাজ' : 'Actions'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.length > 0 ? (
                          orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="text-xs font-mono">
                                {order.id.slice(-8).toUpperCase()}
                              </TableCell>
                              <TableCell className="text-xs">
                                <div className="font-medium">{order.user?.name || 'N/A'}</div>
                                <div className="text-muted-foreground text-[10px]">{order.deliveryPhone}</div>
                              </TableCell>
                              <TableCell className="text-xs">
                                {order.items.length} {isBn ? 'টি' : 'items'}
                              </TableCell>
                              <TableCell className="text-xs font-medium">
                                {formatTaka(order.finalAmount)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className={`text-[10px] px-1.5 py-0.5 ${getStatusColor(order.orderStatus)}`}>
                                  {getStatusLabel(order.orderStatus, isBn)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Select
                                    onValueChange={(val) => handleUpdateOrderStatus(order.id, val)}
                                  >
                                    <SelectTrigger className="h-7 w-7 p-0 border-0" size="sm">
                                      <Edit className="size-3.5 text-green-600" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">{isBn ? 'পেন্ডিং' : 'Pending'}</SelectItem>
                                      <SelectItem value="confirmed">{isBn ? 'নিশ্চিত' : 'Confirmed'}</SelectItem>
                                      <SelectItem value="processing">{isBn ? 'প্রসেসিং' : 'Processing'}</SelectItem>
                                      <SelectItem value="shipped">{isBn ? 'শিপড' : 'Shipped'}</SelectItem>
                                      <SelectItem value="delivered">{isBn ? 'ডেলিভার্ড' : 'Delivered'}</SelectItem>
                                      <SelectItem value="cancelled">{isBn ? 'বাতিল' : 'Cancelled'}</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    onClick={() => setSelectedOrder(order)}
                                  >
                                    <Eye className="size-3.5 text-orange-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                              {isBn ? 'কোনো অর্ডার পাওয়া যায়নি' : 'No orders found'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {orderTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={orderPage <= 1}
                  onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {orderPage} / {orderTotalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={orderPage >= orderTotalPages}
                  onClick={() => setOrderPage((p) => p + 1)}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}

            {/* Order Detail Dialog */}
            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {isBn ? 'অর্ডার বিস্তারিত' : 'Order Details'}
                  </DialogTitle>
                  <DialogDescription>
                    #{selectedOrder?.id.slice(-8).toUpperCase()}
                  </DialogDescription>
                </DialogHeader>
                {selectedOrder && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">{isBn ? 'গ্রাহক' : 'Customer'}</p>
                        <p className="font-medium">{selectedOrder.user?.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">{isBn ? 'ফোন' : 'Phone'}</p>
                        <p className="font-medium">{selectedOrder.deliveryPhone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground text-xs">{isBn ? 'ঠিকানা' : 'Address'}</p>
                        <p className="font-medium text-xs">{selectedOrder.deliveryAddress}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">{isBn ? 'পেমেন্ট' : 'Payment'}</p>
                        <Badge variant="secondary" className={getStatusColor(selectedOrder.paymentStatus)}>
                          {selectedOrder.paymentMethod.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">{isBn ? 'স্ট্যাটাস' : 'Status'}</p>
                        <Badge variant="secondary" className={getStatusColor(selectedOrder.orderStatus)}>
                          {getStatusLabel(selectedOrder.orderStatus, isBn)}
                        </Badge>
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-sm font-medium mb-2">{isBn ? 'আইটেমসমূহ' : 'Items'}</p>
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between py-1.5 text-xs border-b last:border-0">
                          <span>{isBn ? item.nameBn : item.nameEn} × {item.quantity} {item.unit}</span>
                          <span className="font-medium">{formatTaka(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isBn ? 'সাবটোটাল' : 'Subtotal'}</span>
                        <span>{formatTaka(selectedOrder.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>{isBn ? 'সর্বমোট' : 'Total'}</span>
                        <span className="text-green-700 dark:text-green-400">{formatTaka(selectedOrder.finalAmount)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* ═══════════ TAB 4: Inventory ═══════════ */}
          <TabsContent value="inventory" className="space-y-6">
            {/* Low Stock Alerts */}
            <Card className="border-red-200/50 dark:border-red-800/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-red-500" />
                  <CardTitle className="text-base sm:text-lg">
                    {isBn ? 'কম স্টক সতর্কতা' : 'Low Stock Alerts'}
                    <span className="text-sm text-muted-foreground ml-2">({isBn ? '১০ এর কম' : 'Below 10'})</span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {inventoryLoading ? (
                  <LoadingSkeleton />
                ) : lowStockProducts.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {lowStockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 bg-red-50/50 dark:bg-red-950/10 rounded-lg border border-red-100 dark:border-red-900/30"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {isBn ? product.nameBn : product.nameEn}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isBn ? product.category?.nameBn : product.category?.nameEn}
                          </p>
                        </div>
                        <div className="w-24">
                          <Progress
                            value={(product.stock / 10) * 100}
                            className="h-2 bg-red-100 dark:bg-red-900/30 [&>div]:bg-red-500"
                          />
                        </div>
                        <span className="text-sm font-bold text-red-600 dark:text-red-400 w-8 text-right">
                          {product.stock}
                        </span>
                        {stockUpdateId === product.id ? (
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={stockUpdateValue}
                              onChange={(e) => setStockUpdateValue(e.target.value)}
                              className="w-16 h-7 text-xs"
                              min="0"
                            />
                            <Button
                              size="icon"
                              className="size-7 bg-green-600 hover:bg-green-700"
                              onClick={() => handleQuickStockUpdate(product.id)}
                            >
                              <Check className="size-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-7"
                              onClick={() => { setStockUpdateId(null); setStockUpdateValue('') }}
                            >
                              <X className="size-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => { setStockUpdateId(product.id); setStockUpdateValue(String(product.stock)) }}
                          >
                            {isBn ? 'আপডেট' : 'Update'}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Check className="size-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm">{isBn ? 'সব পণ্যের স্টক পর্যাপ্ত' : 'All products have sufficient stock'}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stock Level Indicators */}
            <Card className="border-green-200/50 dark:border-green-800/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">
                  {isBn ? 'স্টক লেভেল' : 'Stock Levels'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inventoryLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {inventoryProducts.slice(0, 20).map((product) => {
                      const maxStock = 200
                      const stockPercent = Math.min((product.stock / maxStock) * 100, 100)
                      const barColor =
                        product.stock < 10
                          ? 'bg-red-500'
                          : product.stock < 30
                            ? 'bg-orange-500'
                            : 'bg-green-500'
                      const trackColor =
                        product.stock < 10
                          ? 'bg-red-100 dark:bg-red-900/30'
                          : product.stock < 30
                            ? 'bg-orange-100 dark:bg-orange-900/30'
                            : 'bg-green-100 dark:bg-green-900/30'

                      return (
                        <div key={product.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="truncate max-w-[200px]">
                              {isBn ? product.nameBn : product.nameEn}
                            </span>
                            <span className="font-medium">{product.stock} {isBn ? 'টি' : 'units'}</span>
                          </div>
                          <div className={`h-2 rounded-full overflow-hidden ${trackColor}`}>
                            <div
                              className={`h-full rounded-full transition-all ${barColor}`}
                              style={{ width: `${stockPercent}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category Stock Summary */}
            <Card className="border-orange-200/50 dark:border-orange-800/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">
                  {isBn ? 'ক্যাটাগরি অনুযায়ী স্টক' : 'Category-wise Stock'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inventoryLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">{isBn ? 'ক্যাটাগরি' : 'Category'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'পণ্য সংখ্যা' : 'Products'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'মোট স্টক' : 'Total Stock'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'গড় স্টক' : 'Avg Stock'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(categoryStockSummary).map(([category, data]) => (
                          <TableRow key={category}>
                            <TableCell className="text-xs font-medium">{category}</TableCell>
                            <TableCell className="text-xs">{data.total}</TableCell>
                            <TableCell className="text-xs">{data.inStock}</TableCell>
                            <TableCell className="text-xs">
                              {Math.round(data.inStock / data.total)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════ TAB 5: Coupons ═══════════ */}
          <TabsContent value="coupons" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                {isBn ? `সক্রিয় কুপন: ${coupons.filter((c) => c.isActive).length}` : `Active coupons: ${coupons.filter((c) => c.isActive).length}`}
              </h3>
              <Button
                onClick={() => setCouponDialogOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Plus className="size-4" />
                {isBn ? 'নতুন কুপন' : 'New Coupon'}
              </Button>
            </div>

            <Card className="border-orange-200/50 dark:border-orange-800/30">
              <CardContent className="p-0">
                {couponsLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">{isBn ? 'কোড' : 'Code'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'ডিসকাউন্ট' : 'Discount'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'ন্যূনতম অর্ডার' : 'Min Order'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'ব্যবহার' : 'Usage'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'মেয়াদ' : 'Expiry'}</TableHead>
                          <TableHead className="text-xs">{isBn ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {coupons.length > 0 ? (
                          coupons.map((coupon) => (
                            <TableRow key={coupon.id}>
                              <TableCell className="text-xs font-mono font-bold text-orange-700 dark:text-orange-400">
                                {coupon.code}
                              </TableCell>
                              <TableCell className="text-xs">
                                {coupon.discountType === 'percentage'
                                  ? `${coupon.discount}%`
                                  : formatTaka(coupon.discount)}
                              </TableCell>
                              <TableCell className="text-xs">
                                {formatTaka(coupon.minOrder)}
                              </TableCell>
                              <TableCell className="text-xs">
                                <span className="font-medium">{coupon.usedCount}</span>
                                {coupon.usageLimit && <span className="text-muted-foreground"> / {coupon.usageLimit}</span>}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {coupon.expiresAt
                                  ? new Date(coupon.expiresAt).toLocaleDateString('bn-BD')
                                  : isBn ? 'অসীম' : 'Never'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={coupon.isActive}
                                    onCheckedChange={() => handleToggleCoupon(coupon.id, coupon.isActive)}
                                  />
                                  <span className="text-[10px] text-muted-foreground">
                                    {coupon.isActive ? (isBn ? 'সক্রিয়' : 'On') : (isBn ? 'নিষ্ক্রিয়' : 'Off')}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              {isBn ? 'কোনো কুপন নেই' : 'No coupons yet'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Coupon Dialog */}
            <Dialog open={couponDialogOpen} onOpenChange={setCouponDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{isBn ? 'নতুন কুপন তৈরি' : 'Create New Coupon'}</DialogTitle>
                  <DialogDescription>
                    {isBn ? 'কুপনের তথ্য পূরণ করুন' : 'Fill in coupon details'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">{isBn ? 'কুপন কোড' : 'Coupon Code'}</label>
                    <Input
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                      placeholder="SAVE20"
                      className="uppercase"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">{isBn ? 'ডিসকাউন্ট' : 'Discount'}</label>
                      <Input
                        type="number"
                        value={couponForm.discount}
                        onChange={(e) => setCouponForm({ ...couponForm, discount: e.target.value })}
                        placeholder="20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">{isBn ? 'ধরন' : 'Type'}</label>
                      <Select
                        value={couponForm.discountType}
                        onValueChange={(val) => setCouponForm({ ...couponForm, discountType: val })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">{isBn ? 'শতাংশ %' : 'Percentage %'}</SelectItem>
                          <SelectItem value="fixed">{isBn ? 'নির্দিষ্ট ৳' : 'Fixed ৳'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">{isBn ? 'ন্যূনতম অর্ডার' : 'Min Order'}</label>
                      <Input
                        type="number"
                        value={couponForm.minOrder}
                        onChange={(e) => setCouponForm({ ...couponForm, minOrder: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">{isBn ? 'সর্বোচ্চ ছাড়' : 'Max Discount'}</label>
                      <Input
                        type="number"
                        value={couponForm.maxDiscount}
                        onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value })}
                        placeholder={isBn ? 'ঐচ্ছিক' : 'Optional'}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">{isBn ? 'ব্যবহার সীমা' : 'Usage Limit'}</label>
                      <Input
                        type="number"
                        value={couponForm.usageLimit}
                        onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })}
                        placeholder={isBn ? 'ঐচ্ছিক' : 'Optional'}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">{isBn ? 'মেয়াদ শেষ' : 'Expiry Date'}</label>
                      <Input
                        type="date"
                        value={couponForm.expiresAt}
                        onChange={(e) => setCouponForm({ ...couponForm, expiresAt: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCouponDialogOpen(false)}>
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleCreateCoupon}
                    disabled={couponFormLoading || !couponForm.code || !couponForm.discount}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {couponFormLoading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    {isBn ? 'তৈরি করুন' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* ═══════════ TAB 6: Reviews ═══════════ */}
          <TabsContent value="reviews" className="space-y-6">
            {/* Rating Distribution */}
            <Card className="border-amber-200/50 dark:border-amber-800/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">
                  {isBn ? 'রেটিং বিতরণ' : 'Rating Distribution'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ratingDistribution.map(({ rating, count }) => (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{rating}</span>
                      </div>
                      <div className="flex-1 h-3 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all"
                          style={{ width: `${(count / maxRatingCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <Card className="border-amber-200/50 dark:border-amber-800/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">
                  {isBn ? 'সাম্প্রতিক রিভিউ' : 'Recent Reviews'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div
                          key={review.id}
                          className="p-3 rounded-lg border border-amber-100 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-950/10"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{review.user?.name || isBn ? 'গ্রাহক' : 'Customer'}</span>
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`size-3 ${
                                        i < review.rating
                                          ? 'fill-amber-400 text-amber-400'
                                          : 'text-gray-300 dark:text-gray-600'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">
                                {isBn ? review.product?.nameBn : review.product?.nameEn}
                              </p>
                              {review.comment && (
                                <p className="text-sm text-foreground">{review.comment}</p>
                              )}
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {new Date(review.createdAt).toLocaleDateString('bn-BD')}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 shrink-0"
                              onClick={() => handleDeleteReview(review.id)}
                            >
                              <Trash2 className="size-3.5 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        {isBn ? 'কোনো রিভিউ নেই' : 'No reviews yet'}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {reviewTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={reviewPage <= 1}
                  onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {reviewPage} / {reviewTotalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={reviewPage >= reviewTotalPages}
                  onClick={() => setReviewPage((p) => p + 1)}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
