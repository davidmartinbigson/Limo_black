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
  title: "Limo Black | Global Private Limousine & Chauffeur Service",
  description:
    "Reserve five-star private limousines, Maybach Pullman, S-Class, and executive airport chauffeurs across 500+ cities in 64+ countries. Fixed all-inclusive rates.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-obsidian-950 text-ivory-50 font-sans">
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
