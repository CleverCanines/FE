import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import StandardButton from "@/components/StandardButton"; // Assuming StandardButton is defined here
import { useAppDispatch } from "@/hooks/groupHooks";
import { Group, setGroup, SetGroupPayload } from "@/features/groupInfo/groupInfoSlice";
import { router } from "expo-router";
import { Provider } from "react-redux";
import { groupInfo } from "@/stores/groupInfoStore";

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
          dispatch(setGroup({ group: Group.Client, id: "66249183-c8a3-4482-a65b-0947aac07369" } as SetGroupPayload)); // TODO: hardcoded id
          router.navigate("/(tabs)/home");
        }}
      />
      <StandardButton 
        title="Raiser"
        group={Group.Raiser}
        onPress={() => {
          console.log("Raiser");
          dispatch(setGroup({ group: Group.Raiser, id: "a2b9d0cf-40f4-4f72-8d10-b3450e7025d6" } as SetGroupPayload)); // TODO: hardcoded id
          router.navigate("/(tabs)/home");
        }}
      />
      <StandardButton 
        title="Staff"
        group={Group.Staff}
        onPress={() => {
          console.log("Staff");
          dispatch(setGroup({ group: Group.Staff, id: "67ab9a75-aae9-4242-a455-51df0bcd0422" } as SetGroupPayload)); // TODO: hardcoded id
          router.navigate("/(tabs)/home");
        }}
      />
    </ThemedView>
  );
}
