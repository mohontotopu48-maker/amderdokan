'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowRight, Package } from 'lucide-react'
import { useStore, type Product } from '@/store/use-store'
import { ProductCard } from './product-card'

interface ProductGridProps {
  title: string
  titleBn?: string
  products: Product[]
  loading?: boolean
  emptyMessage?: string
  emptyMessageBn?: string
  onViewAll?: () => void
  columns?: 2 | 3 | 4
}

export function ProductGrid({
  title,
  titleBn,
  products,
  loading = false,
  emptyMessage = 'No products found',
  emptyMessageBn,
  onViewAll,
  columns = 4,
}: ProductGridProps) {
  const { language, setSelectedCategoryId, setCurrentView } = useStore()
  const isBn = language === 'bn'

  const displayTitle = isBn && titleBn ? titleBn : title
  const displayEmptyMessage = isBn && emptyMessageBn ? emptyMessageBn : emptyMessage

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll()
    } else {
      setCurrentView('products')
    }
  }

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold sm:text-xl">{displayTitle}</h2>
        {onViewAll && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-primary hover:text-primary/80"
            onClick={handleViewAll}
          >
            {isBn ? 'সব দেখুন' : 'View All'}
            <ArrowRight className="size-4" />
          </Button>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className={`grid gap-3 sm:gap-4 ${gridCols[columns]}`}>
          {Array.from({ length: columns * 2 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-xl border p-0 overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="space-y-2 p-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-12">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <Package className="size-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{displayEmptyMessage}</p>
        </div>
      )}

      {/* Product Grid */}
      {!loading && products.length > 0 && (
        <div className={`grid gap-3 sm:gap-4 ${gridCols[columns]}`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
