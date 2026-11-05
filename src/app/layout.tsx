import type { Metadata } from "next";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "./globals.css";

import { BookingProvider } from "@/context/BookingContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import ConciergeChat from "@/components/ConciergeChat";

export const metadata: Metadata = {
  title: "LimoBlack Canada | Premium Limousine & Executive Chauffeur Service",
  description:
    "Reserve five-star private limousines, Maybach Pullman, AWD S-Class, Escalade ESV, and airport chauffeurs across Toronto (YYZ), Vancouver (YVR), Montréal (YUL), Calgary (YYC), Ottawa & Whistler. Fixed all-inclusive CAD fares.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-CA" className="dark" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-canvas text-ink font-sans">
        <BookingProvider>
          <Navbar />
          <AuthModal />
          <main className="flex-1">{children}</main>
          <Footer />
          <ConciergeChat />
        </BookingProvider>
      </body>
    </html>
  );
}
