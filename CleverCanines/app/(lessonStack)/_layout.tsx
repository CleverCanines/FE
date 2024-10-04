import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import {Stack} from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function _layout() {
    const title = useLocalSearchParams().title;
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, 'background'),
                },
                headerTintColor: useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, 'text'),
                headerTitle() {
                    return (
                        <ThemedText>{ title }</ThemedText>
                      );
                },
            }}
        >
            <Stack.Screen 
                name='tasks'
            />
            <Stack.Screen 
                name='screen'
            />
        </Stack>
    );
}