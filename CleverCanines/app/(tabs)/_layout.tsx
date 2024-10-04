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

export default function TabLayout() {
  return (
    <Provider store={groupInfo}>
      <TabLayoutContent />
    </Provider>
  );
}

function TabLayoutContent() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const group = groupInfo.getState().group.value;
  const groupColor = Colors[group];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerRight: () => (
          <Pressable
            onPress={() => {
              // Update groupInfo store
              dispatch(setGroup(Group.Unknown));
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
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          title: 'Lessons',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'git-network' : 'git-network-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sitting"
        options={{
          title: 'Puppy Sitting',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'paw' : 'paw-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="faq"
        options={{
          title: 'FAQ',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'help-circle' : 'help-circle-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
