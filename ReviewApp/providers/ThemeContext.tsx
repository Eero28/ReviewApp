import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useColorScheme } from "react-native";
import { colorsDarkmode, colorsLightmode } from "../themes/colors";
import { paddingSpacing } from "../themes/spacing";
import { fonts, fontSizes } from "../themes/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeType = "light" | "dark";

interface ThemeContextProps {
    scheme: ThemeType;
    toggleTheme: () => void;
    colors: typeof colorsDarkmode;
    fonts: typeof fonts;
    paddingSpacing: typeof paddingSpacing;
    fontSizes: typeof fontSizes;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const userPreference = useColorScheme();
    const [scheme, setScheme] = useState<ThemeType | null>(null);

    // Load saved theme or fallback to system
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const saved = await AsyncStorage.getItem("theme-scheme");
                if (saved === "light" || saved === "dark") {
                    setScheme(saved);
                } else {
                    setScheme(userPreference === "dark" ? "dark" : "light");
                }
            } catch (err) {
                console.log("Failed to load theme:", err);
                setScheme(userPreference === "dark" ? "dark" : "light");
            }
        };
        loadTheme();
    }, [userPreference]);

    const toggleTheme = async () => {
        if (!scheme) return;
        const userPreference = scheme === "light" ? "dark" : "light";
        setScheme(userPreference);
        await AsyncStorage.setItem("theme-scheme", userPreference);

    };



    if (!scheme) return null;

    const colors = scheme === "light" ? colorsLightmode : colorsDarkmode;

    return (
        <ThemeContext.Provider value={{ scheme, toggleTheme, colors, fonts, paddingSpacing, fontSizes }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used inside ThemeProvider");
    return context;
};
