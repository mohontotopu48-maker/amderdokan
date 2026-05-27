import type { Metadata } from "next";
import { Hind_Siliguri, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://amardokaan.com.bd"),
  title: "আমাদের দোকান - Online Grocery Shop in Mohammadpur, Dhaka",
  description:
    "আমাদের দোকান - Mohammadpur, Dhaka-এর সেরা অনলাইন গ্রোসারি শপ। তাজা শাকসবজি, ফলমূল, মাছ, মাংস, চাল, ডাল সহ সব পণ্য ঘরে বসে অর্ডার করুন। ৫০০ টাকার উপরে ফ্রি ডেলিভারি।",
  keywords: [
    "আমাদের দোকান",
    "Amar Dokaan",
    "online grocery Bangladesh",
    "Mohammadpur grocery",
    "Dhaka grocery shop",
    "তাজা শাকসবজি",
    "অনলাইন দোকান",
    "গ্রোসারি শপ ঢাকা",
    "online dokaan",
    "grocery delivery Dhaka",
    "বাংলাদেশ গ্রোসারি",
  ],
  authors: [{ name: "Nibir Hossain" }],
  icons: {
    icon: "/logo-bazar-new.png",
  },
  openGraph: {
    title: "আমাদের দোকান - Online Grocery Shop in Mohammadpur, Dhaka",
    description:
      "Mohammadpur-এর সেরা অনলাইন গ্রোসারি শপ। তাজা পণ্য, দ্রুত ডেলিভারি, সেরা দাম।",
    url: "https://amardokaan.com.bd",
    siteName: "আমাদের দোকান",
    type: "website",
    locale: "bn_BD",
    images: [
      {
        url: "/logo-bazar-new.png",
        width: 512,
        height: 512,
        alt: "আমাদের দোকান - Online Grocery Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "আমাদের দোকান - Online Grocery Shop",
    description:
      "Mohammadpur-এর সেরা অনলাইন গ্রোসারি শপ। তাজা পণ্য, দ্রুত ডেলিভারি।",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "আমাদের দোকান",
  alternateName: "Amar Dokaan",
  description:
    "Mohammadpur, Dhaka-এর সেরা অনলাইন গ্রোসারি শপ। তাজা শাকসবজি, ফলমূল, মাছ, মাংস সহ সব পণ্য ঘরে বসে অর্ডার করুন।",
  url: "https://amardokaan.com.bd",
  telephone: "+8801700000000",
  image: "https://amardokaan.com.bd/logo-bazar-new.png",
  priceRange: "৳৳",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Mohammadpur Housing, Limited Art, House Number 123",
    addressLocality: "Dhaka",
    addressRegion: "Dhaka",
    postalCode: "1207",
    addressCountry: "BD",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 23.7561,
    longitude: 90.3872,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "22:00",
    },
  ],
  sameAs: [
    "https://facebook.com/amardokaan",
    "https://instagram.com/amardokaan",
  ],
  paymentAccepted: "bKash, Nagad, Rocket, Cash on Delivery",
  founder: {
    "@type": "Person",
    name: "Nibir Hossain",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${hindSiliguri.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
