import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar        from "@/components/Navbar";
import Footer        from "@/components/Footer";
import CustomCursor  from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import ScrollProgress from "@/components/ScrollProgress";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Laliguras Club — Flower Society · Woosong University, Daejeon",
  description:
    "A sanctuary for flower lovers at Woosong University, Daejeon, South Korea. Dedicated to cultivating, celebrating, and sharing the beauty of flowering plants.",
  keywords: "Laliguras, flower club, Woosong University, Daejeon, South Korea, botanical society, rhododendron, floral cultivation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}
    >
      <body>
        <ClerkProvider>
          <ScrollProgress />
          <CustomCursor />
          <Navbar />
          <PageTransition>
            <main>{children}</main>
            <Footer />
          </PageTransition>
        </ClerkProvider>
      </body>
    </html>
  );
}
