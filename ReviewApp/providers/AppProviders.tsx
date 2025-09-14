import React, { ReactNode } from "react";
import { AuthProvider } from "./ContexApi";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { SearchProvider } from "./SearchBarContext";
import { StatusBar } from "react-native";

interface AppProvidersProps {
  children: ReactNode;
}

const ThemedStatusBar = () => {
  const { colors } = useTheme();

  return (
    <StatusBar
      barStyle={colors.statusBarColor}
      backgroundColor={colors.bg}
    />
  );
};

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <SearchProvider>
        <AuthProvider>
          <ThemedStatusBar />
          {children}
        </AuthProvider>
      </SearchProvider>
    </ThemeProvider>
  );
};
