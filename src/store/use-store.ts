import { create } from 'zustand'

export interface CartItem {
  id: string
  productId: string
  productNameBn: string
  productNameEn: string
  price: number
  originalPrice?: number
  unit: string
  quantity: number
  image: string
  discount: number
}

export interface Product {
  id: string
  nameBn: string
  nameEn: string
  slug: string
  descriptionBn: string | null
  descriptionEn: string | null
  price: number
  originalPrice: number | null
  unit: string
  stock: number
  images: string[]
  categoryId: string
  isOrganic: boolean
  isFeatured: boolean
  isTrending: boolean
  discount: number
  rating: number
  reviewCount: number
  isActive: boolean
  discountedPrice?: number
  brand?: {
    id: string
    nameBn: string
    nameEn: string
    slug: string
    logo: string
  }
  category?: {
    id: string
    nameBn: string
    nameEn: string
    icon: string
    slug?: string
  }
}

export interface Category {
  id: string
  nameBn: string
  nameEn: string
  slug: string
  icon: string
  image: string | null
  description: string | null
  order: number
  _count?: { products: number }
}

export interface Order {
  id: string
  totalAmount: number
  discountAmount: number
  deliveryFee: number
  finalAmount: number
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  deliveryAddress: string
  deliveryPhone: string
  couponCode: string | null
  notes: string | null
  createdAt: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  nameBn: string
  nameEn: string
  unit: string
}

export type AppView = 'home' | 'products' | 'product-detail' | 'cart' | 'checkout' | 'orders' | 'admin' | 'about'

interface AppState {
  // UI State
  currentView: AppView
  selectedProductId: string | null
  selectedCategoryId: string | null
  searchQuery: string
  isSearchOpen: boolean
  isCartOpen: boolean
  isCheckoutOpen: boolean
  isBillPaymentOpen: boolean
  billPaymentType: string | null
  language: 'bn' | 'en'

  // Cart
  cartItems: CartItem[]
  cartLoading: boolean

  // Data
  products: Product[]
  categories: Category[]
  orders: Order[]

  // Coupon
  couponCode: string | null

  // Admin
  isAdminMode: boolean

  // Actions
  setCurrentView: (view: AppView) => void
  setSelectedProductId: (id: string | null) => void
  setSelectedCategoryId: (id: string | null) => void
  setSearchQuery: (query: string) => void
  setIsSearchOpen: (open: boolean) => void
  setIsCartOpen: (open: boolean) => void
  setIsCheckoutOpen: (open: boolean) => void
  setIsBillPaymentOpen: (open: boolean) => void
  setBillPaymentType: (type: string | null) => void
  setLanguage: (lang: 'bn' | 'en') => void
  setCartItems: (items: CartItem[]) => void
  setCartLoading: (loading: boolean) => void
  setProducts: (products: Product[]) => void
  setCategories: (categories: Category[]) => void
  setOrders: (orders: Order[]) => void
  setIsAdminMode: (mode: boolean) => void

  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  updateCartItemQuantity: (productId: string, quantity: number) => void
  clearCart: () => void

  getCartTotal: () => number
  getCartItemCount: () => number
  getCartSavings: () => number
}

export const useStore = create<AppState>((set, get) => ({
  // UI State
  currentView: 'home',
  selectedProductId: null,
  selectedCategoryId: null,
  searchQuery: '',
  isSearchOpen: false,
  isCartOpen: false,
  isCheckoutOpen: false,
  isBillPaymentOpen: false,
  billPaymentType: null,
  language: 'bn',

  // Cart
  cartItems: [],
  cartLoading: false,

  // Data
  products: [],
  categories: [],
  orders: [],

  // Coupon
  couponCode: null,

  // Admin
  isAdminMode: false,

  // Actions
  setCurrentView: (view) => set({ currentView: view }),
  setSelectedProductId: (id) => set({ selectedProductId: id }),
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsSearchOpen: (open) => set({ isSearchOpen: open }),
  setIsCartOpen: (open) => set({ isCartOpen: open }),
  setIsCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
  setIsBillPaymentOpen: (open) => set({ isBillPaymentOpen: open }),
  setBillPaymentType: (type) => set({ billPaymentType: type }),
  setLanguage: (lang) => set({ language: lang }),
  setCartItems: (items) => set({ cartItems: items }),
  setCartLoading: (loading) => set({ cartLoading: loading }),
  setProducts: (products) => set({ products }),
  setCategories: (categories) => set({ categories }),
  setOrders: (orders) => set({ orders }),
  setIsAdminMode: (mode) => set({ isAdminMode: mode }),

  addToCart: (item) => {
    const { cartItems } = get()
    const existing = cartItems.find((i) => i.productId === item.productId)
    if (existing) {
      set({
        cartItems: cartItems.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      })
    } else {
      set({ cartItems: [...cartItems, item] })
    }
  },

  removeFromCart: (productId) => {
    set({ cartItems: get().cartItems.filter((i) => i.productId !== productId) })
  },

  updateCartItemQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }
    set({
      cartItems: get().cartItems.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      ),
    })
  },

  clearCart: () => set({ cartItems: [] }),

  getCartTotal: () => {
    return get().cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  },

  getCartItemCount: () => {
    return get().cartItems.reduce((count, item) => count + item.quantity, 0)
  },

  getCartSavings: () => {
    return get().cartItems.reduce((savings, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return savings + (item.originalPrice - item.price) * item.quantity
      }
      return savings
    }, 0)
  },
}))
