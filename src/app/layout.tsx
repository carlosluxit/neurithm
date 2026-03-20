import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { organizationSchema, websiteSchema, serviceSchema } from "@/lib/schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Neurithm — AI Transformation Synchronized to Your Ambition",
    template: "%s | Neurithm",
  },
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
    "AI transformation agency",
    "machine learning consulting",
    "intelligent automation",
  ],
  metadataBase: new URL("https://neurithm.ai"),
  openGraph: {
    title: "Neurithm — AI Transformation Synchronized to Your Ambition",
    description:
      "From discovery to scaling, Neurithm synchronizes AI transformation to your ambition. Get your free AI readiness score.",
    type: "website",
    siteName: "Neurithm",
    url: "https://neurithm.ai",
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
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://neurithm.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemas = [organizationSchema(), websiteSchema(), serviceSchema()];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        {schemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
            }}
          />
        ))}
      </head>
      <body className="min-h-full flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
