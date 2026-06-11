import { useColorScheme } from 'react-native';

export function useThemeColors() {
  const scheme = useColorScheme(); // 'dark' ya 'light' detect karega
  const isDark = scheme === 'dark';

  return {
    background: isDark ? '#18181B' : '#FFFFFF', // Dark grey vs White
    text: isDark ? '#FAFAFA' : '#09090B',       // White vs Black
    inputBg: isDark ? '#27272A' : '#F4F4F5',    // Darker grey vs Light grey
    isDark
  };
}