import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk, Darker_Grotesque } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { organizationSchema, websiteSchema, serviceSchema } from "@/lib/schema";

const darkerGrotesque = Darker_Grotesque({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    default: "Luxit — IT Solutions & AI Transformation at Your Service",
    template: "%s | Luxit",
  },
  description:
    "Luxit empowers enterprises with end-to-end technology solutions — from AI strategy and automation to hospitality IT infrastructure. IT consulting, AI agents, process automation, and managed services.",
  keywords: [
    "AI transformation",
    "AI consulting",
    "AI agents",
    "business automation",
    "AI strategy",
    "enterprise AI",
    "hospitality technology",
    "managed IT services",
    "IT solutions",
    "process automation",
    "AI agent development",
    "technology consulting",
    "intelligent automation",
    "hotel technology",
  ],
  metadataBase: new URL("https://luxit.io"),
  openGraph: {
    title: "Luxit — IT Solutions & AI Transformation at Your Service",
    description:
      "End-to-end technology solutions for enterprises. AI strategy, automation, managed IT, and hospitality technology — all under one roof.",
    type: "website",
    siteName: "Luxit",
    url: "https://luxit.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxit — IT Solutions & AI Transformation",
    description:
      "Empowering enterprises with technology solutions across every industry.",
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
    canonical: "https://luxit.io",
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
      className={`${darkerGrotesque.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
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
        <script src="https://cdn.touchup.dev/script.js" data-site="1282700f-ea01-4ea1-921f-2eef3f973910" defer></script>
      </body>
    </html>
  );
}
