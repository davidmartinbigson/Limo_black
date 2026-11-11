"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConciergeChat from "@/components/ConciergeChat";
import AuthModal from "@/components/AuthModal";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const admin = path.startsWith("/admin") || path.startsWith("/driver");
  return <>{!admin && <Navbar />}<AuthModal /><main className="flex-1">{children}</main>{!admin && <><Footer /><ConciergeChat /></>}</>;
}
