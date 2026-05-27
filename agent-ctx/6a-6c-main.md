# Task 6a-6c - Bug Fixes

## Summary
Fixed 3 critical bugs in the আমাদের বাজার e-commerce application.

## Bug 1: Search API Returns Empty Results for Bangla Text
- **Root Cause**: Header search overlay only set `searchQuery` in Zustand store but never called `/api/search?q=` API endpoint. The overlay only had hardcoded suggestion buttons.
- **Fix**: Rewrote search overlay in header.tsx with debounced API calls, real result display (products + categories), and click navigation.

## Bug 2: Cart Local/API State Desync
- **Root Cause**: ProductCard/ProductDetail added to cart with `id: 'temp-xxx'` locally. API returned real DB ID but it was never used, causing PUT/DELETE to `/api/cart/[id]` to fail.
- **Fix**: Added `updateCartItemId` to Zustand store. After successful POST to `/api/cart`, the real DB ID replaces the temp ID.

## Bug 3: Admin API Routes Have No Auth
- **Root Cause**: All admin routes had zero authentication. Anyone could call them.
- **Fix**: Created cookie-based admin auth system with login/logout routes, and added auth checks to all admin and write routes.

## Files Modified
- `src/components/layout/header.tsx` - Search overlay with API integration
- `src/store/use-store.ts` - Added `updateCartItemId` action
- `src/components/product/product-card.tsx` - Sync real cart item ID after add
- `src/components/product/product-detail.tsx` - Sync real cart item ID after add
- `src/components/admin/admin-login.tsx` - Use API login instead of local check
- `src/app/api/admin/coupons/route.ts` - Added auth check
- `src/app/api/admin/coupons/[id]/route.ts` - Added auth check
- `src/app/api/admin/reviews/route.ts` - Added auth check
- `src/app/api/admin/reviews/[id]/route.ts` - Added auth check
- `src/app/api/admin/revenue/route.ts` - Added auth check
- `src/app/api/products/route.ts` - Added auth check on POST
- `src/app/api/products/[id]/route.ts` - Added auth check on PUT/DELETE
- `src/app/api/orders/[id]/route.ts` - Added auth check on PATCH

## Files Created
- `src/lib/admin-auth.ts` - Admin authentication utility
- `src/app/api/admin/login/route.ts` - Login endpoint
- `src/app/api/admin/logout/route.ts` - Logout endpoint

## Verification
- ESLint passes with zero errors
