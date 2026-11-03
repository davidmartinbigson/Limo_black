import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "./globals.css";

import { BookingProvider } from "@/context/BookingContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

export const metadata: Metadata = {
  title: "Limo Black Canada | Premier Private Limousine & Chauffeur Service",
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
        </BookingProvider>
      </body>
    </html>
  );
}
