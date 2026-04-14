import type { Metadata } from "next";
import { Cairo, Tajawal, Almarai, Rubik } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ScrollReveal from "@/components/layout/ScrollReveal";
import { db } from "@/lib/db";

const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["300", "400", "500", "600", "700", "800", "900"], variable: "--font-cairo" });
const tajawal = Tajawal({ subsets: ["arabic", "latin"], weight: ["300", "400", "500", "700", "800", "900"], variable: "--font-tajawal" });
const almarai = Almarai({ subsets: ["arabic"], weight: ["300", "400", "700", "800"], variable: "--font-almarai" });
const rubik = Rubik({ subsets: ["arabic", "latin"], weight: ["300", "400", "500", "600", "700", "800", "900"], variable: "--font-rubik" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await db.settings.get();
  
  return {
    title: settings.siteName || "الفيروز لخدمات النظافة",
    description: settings.heroDescription,
    icons: {
      icon: settings.favicon || "/favicon.ico",
    },
    openGraph: {
      title: settings.heroTitle || settings.siteName,
      description: settings.heroDescription,
      images: settings.logo ? [{ url: settings.logo }] : [],
      type: "website",
      locale: "ar_SA",
      siteName: settings.siteName,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await db.settings.get();
  
  let fontClass = cairo.className;
  if (settings.fontFamily === 'tajawal') fontClass = tajawal.className;
  if (settings.fontFamily === 'almarai') fontClass = almarai.className;
  if (settings.fontFamily === 'rubik') fontClass = rubik.className;

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable} ${almarai.variable} ${rubik.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary-color: ${settings.primaryColor || '#0ea5e9'};
            --secondary-color: ${settings.secondaryColor || '#06b6d4'};
            --bg-color: ${settings.bgColor || '#020617'};
            --logo-size: ${settings.logoSize || 120}px;
            --font-family: var(--font-${settings.fontFamily || 'cairo'}), 'Inter', system-ui, sans-serif;
          }
        `}} />
      </head>
      <body className={fontClass}>
        <div className="bg-mesh" />
        <ScrollReveal />
        <Header />
        <main style={{ minHeight: '100vh' }}>
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
