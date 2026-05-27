# Worklog - Task 4-a: Layout, Header & Footer

**Date:** 2026-03-05
**Agent:** layout-agent
**Task ID:** 4-a

## Summary
Built the complete main layout, premium sticky header, and premium footer for the "আমাদের বাজার" (Amar Bazar) Bangladeshi grocery e-commerce platform with green/orange brand theming, Bangla/English language support, and dark mode.

## What was done

### 1. Updated `globals.css` — Brand Theme
- Replaced default oklch color system with custom green-primary (#16a34a) + orange-accent (#ea580c) color palette
- Light mode: warm earthy background (#fafaf7), green primary, orange accent
- Dark mode: deep green-tinted dark (#0f1210), bright green primary (#22c55e), orange accent (#f97316)
- Added custom scrollbar styling (both light/dark)
- Added smooth scroll behavior on html
- Added `animate-slide-text` keyframe for delivery banner
- Added `animate-pulse-glow` keyframe for WhatsApp button
- Set `--font-sans` to `--font-hind-siliguri` for Bangla font support

### 2. Created `theme-provider.tsx`
- Simple `"use client"` wrapper around `next-themes` ThemeProvider
- Used with `attribute="class"`, `defaultTheme="light"`, `enableSystem`, `disableTransitionOnChange`

### 3. Updated `layout.tsx`
- Replaced Geist font with Hind Siliguri (supports Bengali + Latin subsets)
- Added ThemeProvider wrapper around children + Toaster
- Updated metadata: title, description, keywords (Bangla SEO), authors, icons (logo-bazar.png)
- Added `metadataBase: new URL("https://amarbazar.com.bd")`
- Added OpenGraph and Twitter card metadata
- Added comprehensive JSON-LD LocalBusiness schema markup (name, address, geo, hours, payment, founder)
- Set `lang="bn"` on html element

### 4. Created `header.tsx` — Premium Sticky Header
- **Delivery Promise Bar**: Green gradient bar with sliding animation showing: free delivery (৳500+), 1-hour delivery in Mohammadpur, 10% first order discount, phone number
- **Main Header Bar**: Logo with brand name, desktop nav links (হোম/পণ্য/অফার/আমাদের সম্পর্কে), search bar (desktop), action buttons
- **Action Buttons**: Search (mobile icon), Language toggle (BN/EN dropdown), Dark mode toggle (sun/moon), Cart button with animated badge count, WhatsApp Quick Order (green pulse glow), Mobile hamburger menu
- **Scroll Behavior**: Adds shadow + reduces padding on scroll via useEffect scroll listener
- **Mobile Menu Sheet**: Left-side Sheet with logo header, nav links with icons, WhatsApp & Call buttons
- **Search Overlay**: Full-width animated search overlay with quick search tags (আলু, পেঁয়াজ, চাল, মাছ, দুধ, মসলা)
- **Mounted State**: Uses `useSyncExternalStore` for SSR-safe hydration check (avoids lint error)
- All navigation uses `useStore.setCurrentView()` for SPA navigation

### 5. Created `footer.tsx` — Premium Footer
- **Trust Badges**: 4 badges (Free Delivery, Fast Delivery, 100% Fresh, Best Price) with icons
- **Brand Info**: Logo, name, tagline "নির্ভরতার একটি নাম", full address, phone, WhatsApp, email, owner name
- **Categories Column**: 6 quick category links
- **Information Column**: Policy links + social media buttons (Facebook, Instagram, YouTube)
- **Payment Methods**: bKash (pink), Nagad (orange), Rocket (purple), Cash on Delivery (green)
- **WhatsApp CTA Button**: Green WhatsApp order button
- **Bottom Bar**: Copyright with year + "নির্ভরতার একটি নাম" tagline
- Full dark mode support with dark green gradient background

### 6. Created `main-layout.tsx` — Main Wrapper
- `min-h-screen flex flex-col` layout for sticky footer
- Renders Header → main content → Footer
- Includes placeholder view components for Home, Products, About views
- View routing based on `useStore.currentView`

### 7. Updated `page.tsx`
- Simple wrapper that renders `<MainLayout />`

### 8. Fixed `customer-reviews.tsx`
- Added missing `Badge` import from `@/components/ui/badge`

## Lint Status
✅ `bun run lint` passes with zero errors

## Files Modified/Created
- `src/app/globals.css` — Updated
- `src/app/layout.tsx` — Updated
- `src/app/page.tsx` — Updated
- `src/components/theme-provider.tsx` — Created
- `src/components/layout/header.tsx` — Created
- `src/components/layout/footer.tsx` — Created
- `src/components/layout/main-layout.tsx` — Created
- `src/components/home/customer-reviews.tsx` — Fixed (Badge import)
