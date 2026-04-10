import { useColorScheme } from "react-native";
import { createContext, useContext } from "react";

const ThemeContext = createContext();

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within an AppThemeProvider");
  }
  return context;
};

export const AppThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = {
    background: isDark ? "#222222" : "#FFFFFF",
    cardBackground: isDark ? "#2A2A2A" : "#FFFFFF",
    surface: isDark ? "#333333" : "#F8F9FA",
    primary: isDark ? "#FFFFFF" : "#000000",
    secondary: isDark ? "#f9c4a2" : "#666666",
    accent: "#cb6622", // Color primario de la marca
    accentLight: "#f9c4a2", // Color secundario de la marca
    accentDark: "#9d5419", // Más oscuro para estados presionados
    accentBackground: isDark ? "#3D2E26" : "#FFF5ED",
    border: isDark ? "#3D3D3D" : "#E5E5E5",
    searchBackground: isDark ? "#2A2A2A" : "#F5F5F5",
    searchPlaceholder: isDark ? "#8E8E93" : "#B9B9B9",
    destructive: isDark ? "#FF6B6B" : "#F44336",
    destructiveBackground: isDark ? "#3D1A1A" : "#FFEBEE",
    tagBackground: isDark ? "#3D2E26" : "#FFF5ED",
    tagInactive: isDark ? "#404040" : "#F5F5F5",
    tagText: isDark ? "#f9c4a2" : "#666666",
    cardShadow: isDark ? "#000000" : "#000000",
    buttonText: "#FFFFFF", // Texto blanco para botones
  };

  const theme = {
    colors,
    isDark,
    colorScheme,
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
