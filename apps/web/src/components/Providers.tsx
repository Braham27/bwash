"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider, useTheme } from "next-themes";

function ClerkProviderWithTheme({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDark ? dark : undefined,
        variables: {
          colorPrimary: "#2563EB",
          colorBackground: isDark ? "#111111" : "#FFFFFF",
          colorInputBackground: isDark ? "#1A1A1A" : "#F1F5F9",
          colorText: isDark ? "#FFFFFF" : "#0F172A",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ClerkProviderWithTheme>{children}</ClerkProviderWithTheme>
    </ThemeProvider>
  );
}
