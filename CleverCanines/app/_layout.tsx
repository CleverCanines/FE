import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from "expo-router";
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

export default function RootLayout() {

  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, 'background');
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{ 
          headerShown: false,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerLeft: () => null
        }}>
        <Stack.Screen 
          name="index"
          options={{ 
            headerShown: true,
            headerTitle() {
              return (
                <ThemedText>Who are you?</ThemedText>
              );
            },
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
