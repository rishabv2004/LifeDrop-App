import React, { createContext, useState } from 'react';
import { useColorScheme } from 'react-native';

// 1. Context create karo
export const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
  colors: { background: '#FFFFFF', text: '#09090B', cardBg: '#FAFAFA', border: '#E4E4E7' }
});

// 2. Provider banao jo poori app ko wrap karega
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = useColorScheme(); // Phone ki default setting
  const [isDark, setIsDark] = useState(systemTheme === 'dark');

  const toggleTheme = () => setIsDark(!isDark);

  // Colors define karo
  const colors = {
    background: isDark ? '#09090B' : '#FFFFFF',   // Black vs White
    text: isDark ? '#FAFAFA' : '#09090B',         // White vs Black
    cardBg: isDark ? '#18181B' : '#FAFAFA',       // Dark Grey vs Light Grey
    border: isDark ? '#27272A' : '#E4E4E7',       // Dark Border vs Light Border
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};