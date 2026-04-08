import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { ThemedToaster } from "@/components/ThemedToaster";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BWash | Premium Mobile Car Wash",
  description:
    "Premium mobile car wash service delivering high-quality cleaning directly to your home or workplace. Book your wash today!",
  keywords: [
    "mobile car wash",
    "car detailing",
    "auto wash",
    "car cleaning",
    "mobile detailing",
  ],
  openGraph: {
    title: "BWash | Premium Mobile Car Wash",
    description:
      "We bring the shine to you — fast, reliable, and professional.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-luxury-black">
        <Providers>
          {children}
          <ThemedToaster />
        </Providers>
      </body>
    </html>
  );
}
