"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Toaster
      theme={isDark ? "dark" : "light"}
      position="top-right"
      toastOptions={{
        style: isDark
          ? { background: "#1A1A1A", border: "1px solid #2A2A2A", color: "#fff" }
          : { background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#0F172A" },
      }}
    />
  );
}
