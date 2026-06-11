import { Stack } from 'expo-router';
import { ThemeProvider } from './context/ThemeContext';

export default function RootLayout() {
  return (
    // ThemeProvider poori app ko wrap karega taaki Switch har jagah kaam kare
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}