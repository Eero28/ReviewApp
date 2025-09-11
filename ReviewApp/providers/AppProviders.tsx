import React, { ReactNode } from "react";
import { AuthProvider } from "./ContexApi";
import { ThemeProvider } from "./ThemeContext";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
};
