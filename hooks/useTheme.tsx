/**
 * Theme Context and Hook
 * Provides dark mode support with system preference detection
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme, ThemeMode } from '@/constants/theme';

const THEME_STORAGE_KEY = '@speedreader/themeMode';

interface ThemeContextType {
    theme: Theme;
    themeMode: ThemeMode;
    isDark: boolean;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved preference
    useEffect(() => {
        AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
            if (saved && ['light', 'dark', 'system'].includes(saved)) {
                setThemeModeState(saved as ThemeMode);
            }
            setIsLoaded(true);
        });
    }, []);

    // Derive actual theme
    const isDark = themeMode === 'system'
        ? systemColorScheme === 'dark'
        : themeMode === 'dark';

    const theme = isDark ? darkTheme : lightTheme;

    const setThemeMode = async (mode: ThemeMode) => {
        setThemeModeState(mode);
        await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    };

    // Don't render until loaded to prevent flash
    if (!isLoaded) return null;

    return (
        <ThemeContext.Provider value={{ theme, themeMode, isDark, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
