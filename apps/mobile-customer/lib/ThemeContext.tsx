import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

type Theme = "light" | "dark";

const lightColors = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  card: "#F1F5F9",
  text: "#0F172A",
  textMuted: "rgba(15,23,42,0.5)",
  textFaint: "rgba(15,23,42,0.3)",
  border: "#E2E8F0",
  tabBar: "#FFFFFF",
  tabBarBorder: "#E2E8F0",
  headerBg: "#FFFFFF",
  inputBg: "#F1F5F9",
  gold: "#2563EB",
  dim: "rgba(15,23,42,0.3)",
  statusBarStyle: "dark" as const,
};

const darkColors = {
  background: "#0A0A0A",
  surface: "#141414",
  card: "#111111",
  text: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.5)",
  textFaint: "rgba(255,255,255,0.3)",
  border: "rgba(255,255,255,0.05)",
  tabBar: "#111111",
  tabBarBorder: "rgba(255,255,255,0.05)",
  headerBg: "#0A0A0A",
  inputBg: "#1A1A1A",
  gold: "#2563EB",
  dim: "rgba(255,255,255,0.3)",
  statusBarStyle: "light" as const,
};

export type AppColors = typeof lightColors;

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: AppColors;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  colors: lightColors,
});

const THEME_KEY = "app_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    SecureStore.getItemAsync(THEME_KEY).then((saved) => {
      if (saved === "light" || saved === "dark") setTheme(saved);
    });
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    SecureStore.setItemAsync(THEME_KEY, next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        colors: theme === "light" ? lightColors : darkColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);
