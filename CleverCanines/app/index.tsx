import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import StandardButton from "@/components/StandardButton"; // Assuming StandardButton is defined here
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
      <StandardButton
        title="Client"
        group={Group.Client}
        onPress={() => {
          console.log("Client");
          dispatch(setGroup(Group.Client));
          router.navigate("/(tabs)/home");
        }}
      />
      <StandardButton 
        title="Raiser"
        group={Group.Raiser}
        onPress={() => {
          console.log("Raiser");
          dispatch(setGroup(Group.Raiser));
          router.navigate("/(tabs)/home");
        }}
      />
      <StandardButton 
        title="Staff"
        group={Group.Staff}
        onPress={() => {
          console.log("Staff");
          dispatch(setGroup(Group.Staff));
          router.navigate("/(tabs)/home");
        }}
      />
    </ThemedView>
  );
}
