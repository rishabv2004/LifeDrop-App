import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* headerShown: false ka matlab hai upar wala white title bar chup jana */}
      <Stack.Screen name="index" />
    </Stack>
  );
}