import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
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
        variables: {
          colorPrimary: "#2563EB",
          colorBackground: "#FFFFFF",
          colorInputBackground: "#F1F5F9",
          colorText: "#0F172A",
        },
      }}
    >
      <html lang="en">
        <body className="min-h-screen bg-white">
          {children}
          <Toaster
            theme="light"
            position="top-right"
            toastOptions={{
              style: {
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                color: "#0F172A",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
