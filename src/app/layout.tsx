import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neurithm — AI Transformation Synchronized to Your Ambition",
  description:
    "Neurithm empowers enterprises to harness AI strategically, intelligently, and efficiently. AI consulting, agent development, process automation, and team enablement.",
  keywords: [
    "AI transformation",
    "AI consulting",
    "AI agents",
    "business automation",
    "AI strategy",
    "enterprise AI",
    "AI readiness assessment",
    "AI ROI calculator",
    "process automation",
    "AI agent development",
  ],
  openGraph: {
    title: "Neurithm — AI Transformation Synchronized to Your Ambition",
    description:
      "From discovery to scaling, Neurithm synchronizes AI transformation to your ambition. Get your free AI readiness score.",
    type: "website",
    siteName: "Neurithm",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neurithm — AI Transformation",
    description:
      "Empowering enterprises to harness AI strategically, intelligently, and efficiently.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Neurithm",
    description:
      "AI Transformation Agency — empowering enterprises to harness AI strategically, intelligently, and efficiently.",
    url: "https://neurithm.ai",
    logo: "https://neurithm.ai/logo.png",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "hello@neurithm.ai",
    },
    offers: [
      {
        "@type": "Offer",
        name: "AI Readiness Assessment",
        description:
          "Free AI readiness assessment that scores your organization across 5 dimensions and provides a personalized transformation roadmap.",
      },
      {
        "@type": "Offer",
        name: "AI Strategy & Consulting",
        description:
          "End-to-end AI strategy consulting from assessment through deployment.",
      },
      {
        "@type": "Offer",
        name: "AI Agent Development",
        description:
          "Custom AI agent development for automation, customer service, sales, and operations.",
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
