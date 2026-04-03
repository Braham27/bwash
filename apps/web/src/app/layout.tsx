import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#C9A84C",
          colorBackground: "#111111",
          colorInputBackground: "#1A1A1A",
          colorText: "#FFFFFF",
        },
      }}
    >
      <html lang="en" className="dark">
        <body className="min-h-screen bg-luxury-black">
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: "#1A1A1A",
                border: "1px solid #2A2A2A",
                color: "#fff",
              },
            }}
          />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
