'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Loader2, Search, TrendingUp, Clock, ShoppingBag, Folder } from 'lucide-react'
import { useStore } from '@/store/use-store'

interface SearchResultProduct {
  id: string
  nameBn: string
  nameEn: string
  slug: string
  price: number
  originalPrice: number | null
  discount: number
  unit: string
  images: string[]
  discountedPrice: number
  rating: number
  category: {
    nameBn: string
    nameEn: string
    slug: string
  } | null
}

interface SearchResultCategory {
  id: string
  nameBn: string
  nameEn: string
  slug: string
  icon: string
  productCount: number
}

const POPULAR_SEARCHES_BN = ['আলু', 'পেঁয়াজ', 'চাল', 'ইলিশ', 'দুধ', 'মসলা', 'তেল', 'ফল']
const POPULAR_SEARCHES_EN = ['Potato', 'Onion', 'Rice', 'Hilsa', 'Milk', 'Spices', 'Oil', 'Fruits']

const RECENT_SEARCHES_KEY = 'amar-bazar-recent-searches'

export function SearchDialog() {
  const { isSearchOpen, setIsSearchOpen, language, setSelectedProductId, setCurrentView, setSelectedCategoryId } = useStore()
  const isBn = language === 'bn'

  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<SearchResultProduct[]>([])
  const [categories, setCategories] = useState<SearchResultCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (stored) {
        setRecentSearches(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
  }, [])

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(!isSearchOpen)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, setIsSearchOpen])

  // Debounced search
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setProducts([])
        setCategories([])
        return
      }

      setLoading(true)
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery.trim())}`
        )
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
          setCategories(data.categories || [])
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Debounce the search query
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!query.trim()) {
      setProducts([])
      setCategories([])
      setLoading(false)
      return
    }

    if (query.trim().length < 2) {
      setProducts([])
      setCategories([])
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, performSearch])

  const addToRecentSearches = (searchTerm: string) => {
    try {
      const updated = [
        searchTerm,
        ...recentSearches.filter((s) => s !== searchTerm),
      ].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
    } catch {
      // ignore
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY)
    } catch {
      // ignore
    }
  }

  const handleProductSelect = (product: SearchResultProduct) => {
    addToRecentSearches(query)
    setIsSearchOpen(false)
    setSelectedProductId(product.id)
    setCurrentView('product-detail')
    setQuery('')
  }

  const handleCategorySelect = (category: SearchResultCategory) => {
    addToRecentSearches(query)
    setIsSearchOpen(false)
    setSelectedCategoryId(category.id)
    setCurrentView('products')
    setQuery('')
  }

  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm)
  }

  const handlePopularSearchClick = (searchTerm: string) => {
    setQuery(searchTerm)
  }

  const handleClose = (open: boolean) => {
    setIsSearchOpen(open)
    if (!open) {
      setTimeout(() => {
        setQuery('')
        setProducts([])
        setCategories([])
        setLoading(false)
      }, 200)
    }
  }

  const hasResults = products.length > 0 || categories.length > 0
  const showRecentOrPopular = !query.trim() || query.trim().length < 2

  return (
    <CommandDialog
      open={isSearchOpen}
      onOpenChange={handleClose}
      title={isBn ? 'পণ্য খুঁজুন' : 'Search Products'}
      description={isBn ? 'পণ্য বা ক্যাটাগরি খুঁজুন' : 'Search for products or categories'}
      className="sm:max-w-xl"
    >
      <CommandInput
        placeholder={isBn ? 'পণ্য খুঁজুন... (যেমন: আলু, চাল)' : 'Search products... (e.g. potato, rice)'}
        value={query}
        onValueChange={setQuery}
      />

      <CommandList className="max-h-[60vh]">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {isBn ? 'খুঁজছি...' : 'Searching...'}
          </div>
        )}

        {!loading && query.trim().length >= 2 && !hasResults && (
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-4">
              <Search className="size-8 text-muted-foreground/50" />
              <p className="text-sm">
                {isBn
                  ? `"${query}" এর জন্য কোনো ফলাফল পাওয়া যায়নি`
                  : `No results found for "${query}"`}
              </p>
              <p className="text-xs text-muted-foreground">
                {isBn
                  ? 'ভিন্ন শব্দ দিয়ে খুঁজুন'
                  : 'Try searching with different keywords'}
              </p>
            </div>
          </CommandEmpty>
        )}

        {/* Recent Searches */}
        {showRecentOrPopular && recentSearches.length > 0 && (
          <CommandGroup
            heading={
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {isBn ? 'সাম্প্রতিক অনুসন্ধান' : 'Recent Searches'}
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {isBn ? 'মুছুন' : 'Clear'}
                </button>
              </div>
            }
          >
            {recentSearches.map((search) => (
              <CommandItem
                key={`recent-${search}`}
                onSelect={() => handleRecentSearchClick(search)}
                className="cursor-pointer"
              >
                <Clock className="size-4 text-muted-foreground" />
                <span>{search}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Popular Searches */}
        {showRecentOrPopular && (
          <CommandGroup
            heading={
              <span className="flex items-center gap-1.5">
                <TrendingUp className="size-3.5" />
                {isBn ? 'জনপ্রিয় অনুসন্ধান' : 'Popular Searches'}
              </span>
            }
          >
            {(isBn ? POPULAR_SEARCHES_BN : POPULAR_SEARCHES_EN).map((search) => (
              <CommandItem
                key={`popular-${search}`}
                onSelect={() => handlePopularSearchClick(search)}
                className="cursor-pointer"
              >
                <TrendingUp className="size-4 text-primary" />
                <span>{search}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Category Results */}
        {!loading && categories.length > 0 && (
          <>
            {showRecentOrPopular && (recentSearches.length > 0 || true) && (
              <CommandSeparator />
            )}
            <CommandGroup
              heading={
                <span className="flex items-center gap-1.5">
                  <Folder className="size-3.5" />
                  {isBn ? 'ক্যাটাগরি' : 'Categories'}
                </span>
              }
            >
              {categories.map((category) => (
                <CommandItem
                  key={`cat-${category.id}`}
                  onSelect={() => handleCategorySelect(category)}
                  className="cursor-pointer"
                >
                  <span className="text-lg">{category.icon || '📁'}</span>
                  <div className="flex-1">
                    <span className="font-medium">
                      {isBn ? category.nameBn : category.nameEn}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.productCount} {isBn ? 'পণ্য' : 'items'}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Product Results */}
        {!loading && products.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup
              heading={
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="size-3.5" />
                  {isBn ? 'পণ্য' : 'Products'}
                </span>
              }
            >
              {products.map((product) => (
                <CommandItem
                  key={`prod-${product.id}`}
                  onSelect={() => handleProductSelect(product)}
                  className="cursor-pointer"
                >
                  <span className="text-lg">
                    {product.images?.[0] || '🛒'}
                  </span>
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate font-medium">
                      {isBn ? product.nameBn : product.nameEn}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {product.category
                          ? isBn
                            ? product.category.nameBn
                            : product.category.nameEn
                          : ''}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-semibold text-primary">
                      ৳{product.discountedPrice}
                    </div>
                    {product.discount > 0 && product.originalPrice && (
                      <div className="text-xs text-muted-foreground line-through">
                        ৳{product.originalPrice}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>

      {/* Keyboard hint */}
      <div className="border-t px-3 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              ↵
            </kbd>{' '}
            {isBn ? 'নির্বাচন করুন' : 'to select'}
          </span>
          <span>
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              Esc
            </kbd>{' '}
            {isBn ? 'বন্ধ করুন' : 'to close'}
          </span>
        </div>
      </div>
    </CommandDialog>
  )
}
