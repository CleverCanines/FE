import { Pressable } from "react-native";
import { Provider } from 'react-redux';
import { groupInfo } from "@/stores/groupInfo";
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppDispatch } from "@/hooks/groupHooks";
import { Group, setGroup } from "@/features/groupInfo/groupInfoSlice";
import { ThemedText } from "@/components/ThemedText";
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { Tabs } from 'expo-router';
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function TabLayout() {
  return (
    <Provider store={groupInfo}>
      <TabLayoutContent />
    </Provider>
  );
}

function TabLayoutContent() {
  const dispatch = useAppDispatch();
  const group = groupInfo.getState().group.value;
  const groupColor = Colors[group].color;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: useThemeColor({ light: Colors.light.tint, dark: Colors.dark.tint }, 'tint'),
        tabBarStyle: {
          backgroundColor: useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, 'background'),
        },
        headerStyle: {
          backgroundColor: useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, 'background'),
        },
        headerShown: true,
        headerRight: () => (
          <Pressable
            style={{ marginRight: 10 }}
            onPress={() => {
              // Update groupInfo store
              dispatch(setGroup(Group.Client));
              // Navigate to login screen (on index)
              router.navigate("/");
            }}
          >
            <Ionicons name="person" size={30} color={groupColor} />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle() {
            return (
              <ThemedText>Home</ThemedText>
            );
          },
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
            name={focused ? 'home' : 'home-outline'} 
            color={ focused ? groupColor : color } 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          headerTitle() {
            return (
              <ThemedText>Lessons</ThemedText>
            );
          },
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
            name={focused ? 'git-network' : 'git-network-outline'} 
            color={ focused ? groupColor : color } 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          headerTitle() {
            return (
              <ThemedText>Events</ThemedText>
            );
          },
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
            name={focused ? 'calendar' : 'calendar-outline'} 
            color={ focused ? groupColor : color } 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sitting"
        options={{
          href: group === Group.Raiser ? '/(tabs)/sitting' : null,
          headerTitle() {
            return (
              <ThemedText>Sitting</ThemedText>
            );
          },
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
            name={focused ? 'paw' : 'paw-outline'} 
            color={ focused ? groupColor : color } 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="faq"
        options={{
          headerTitle() {
            return (
              <ThemedText>FAQ</ThemedText>
            );
          },
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
            name={focused ? 'help-circle' : 'help-circle-outline'} 
            color={ focused ? groupColor : color } 
            />
          )
        }}
      />
    </Tabs>
  );
}
