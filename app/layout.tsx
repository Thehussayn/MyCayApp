import type { Metadata, Viewport } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";
import "./portal/investor.css";

export const viewport: Viewport = {
  themeColor: "#252A2D",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jejeolaproperties.com.ng"),
  title: {
    default:
      "Jeje-Ola Properties — Premium Real Estate & Investment in Nigeria",
    template: "%s | MyCayApp by Jeje-Ola",
  },
  description:
    "Build, own, and grow wealth through trusted real estate. 18 years of excellence, 900+ delivered properties, and two transparent investment plans (GIAP 70/30 & WealthStream 20–24% ROI). Invest with confidence in Abuja and beyond.",
  keywords: [
    "Real estate investment Nigeria",
    "Abuja property investment",
    "Diaspora real estate Nigeria",
    "Guaranteed ROI real estate",
    "70/30 property investment",
    "Guzape luxury homes",
    "Jeje-Ola Properties",
    "MyCayApp",
  ],
  authors: [{ name: "Jeje-Ola Properties Nig. Ltd." }],
  creator: "Jeje-Ola Properties Nig. Ltd.",
  publisher: "Jeje-Ola Properties Nig. Ltd.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://jejeolaproperties.com.ng",
    siteName: "MyCayApp by Jeje-Ola",
    title: "Jeje-Ola Properties — Premium Real Estate & Investment in Nigeria",
    description:
      "Build, own, and grow wealth through trusted real estate. 18 years of excellence, 900+ delivered properties, and two transparent investment plans (GIAP 70/30 & WealthStream 20–24% ROI).",
    images: [
      {
        url: "/brand/mycayapp-horizontal-dark.svg",
        width: 1200,
        height: 630,
        alt: "MyCayApp by Jeje-Ola — Real Estate & Investment Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeje-Ola Properties — Premium Real Estate & Investment in Nigeria",
    description:
      "Build, own, and grow wealth through trusted real estate. 18 years of excellence, 900+ delivered properties in Abuja and beyond.",
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
  icons: {
    icon: "/brand/mycayapp-emblem.svg",
    apple: "/brand/mycayapp-emblem.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "RealEstateAgent"],
    name: "Jeje-Ola Properties Nig. Ltd.",
    alternateName: "MyCayApp by Jeje-Ola",
    url: "https://jejeolaproperties.com.ng",
    logo: "https://jejeolaproperties.com.ng/brand/mycayapp-horizontal-dark.svg",
    telephone: "+2348066873988",
    email: "info@jejeolaproperties.com.ng",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot 1059, Adamu Allero Crescent",
      addressLocality: "Guzape",
      addressRegion: "Abuja",
      addressCountry: "NG",
    },
    founder: {
      "@type": "Person",
      name: "Alhaji (Dr.) Teslim Jeje-Ola Sanusi",
    },
    description:
      "Premium real estate and structured investment platform in Nigeria with 18 years of institutional excellence and 900+ delivered properties.",
    identifier: "RC.1317171",
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-[#FDFDFD] text-[#252A2D]">
        {process.env.DEMO_MODE === "true" && (
          <div className="bg-[#F4EDDE] text-[#252A2D] px-4 py-3 text-center text-sm">
            Demo environment. Use fictitious details. Accounts and changes belong to this browser and expire after two hours.
          </div>
        )}
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
