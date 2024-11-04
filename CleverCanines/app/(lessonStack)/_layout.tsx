import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import {Stack} from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { groupInfo } from '@/stores/groupInfo';


export default function _layout() {
    const title = useLocalSearchParams().title;
    const group = groupInfo.getState().group.group;
    const groupColor = Colors[group].color;
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
                headerLeft: () =>{
                    return (
                        <Pressable
                            style={{ marginLeft: 10 }}
                            onPress={() => {
                                router.back();
                            }}
                        >
                            <Ionicons name="arrow-back" size={30} color={groupColor} />
                        </Pressable>
                    );
                }
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