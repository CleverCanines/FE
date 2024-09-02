import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Pressable } from "react-native";
import { useAppDispatch } from "@/hooks/groupHooks";
import { Group, setGroup } from "@/features/groupInfo/groupInfoSlice";
import { router } from "expo-router";
import { Provider } from "react-redux";
import { groupInfo } from "@/stores/groupInfo";

export default function LoginScreen() {
  return (
    <Provider store={groupInfo}>
      <LoginScreenContent />
    </Provider>
  );
}

function LoginScreenContent() {
  const dispatch = useAppDispatch();

  return (
    <ThemedView>
      <ThemedText>Who are you?</ThemedText>
      <Pressable 
        onPress={() => {
          console.log("Client");
          dispatch(setGroup(Group.Client));
          router.navigate("/(tabs)/home");
        }}
      >
        <ThemedText>Client</ThemedText>
      </Pressable>
      <Pressable 
        onPress={() => {
          console.log("Raiser");
          dispatch(setGroup(Group.Raiser));
          router.navigate("/(tabs)/home");
        }}
      >
        <ThemedText>Raiser</ThemedText>
      </Pressable>
      <Pressable 
        onPress={() => {
          console.log("Staff");
          dispatch(setGroup(Group.Staff));
          router.navigate("/(tabs)/home");
        }}
      >
        <ThemedText>Staff</ThemedText>
      </Pressable>
    </ThemedView>
  );
}
