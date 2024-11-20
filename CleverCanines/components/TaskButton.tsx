import { Pressable, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { ThemedText } from "./ThemedText";
import { groupInfo } from "@/stores/groupInfoStore";
import { Colors } from "@/constants/Colors";


export default function TaskButton(props: { title: string, progress: number, unlocked: boolean, onPress: () => void }) {
  const { title, progress, unlocked,  onPress} = props;
  const group = groupInfo.getState().group.group;
  const backgroundColor = unlocked ? Colors[group].color : 'gray';
  const color = 'white';
  return (
    <Pressable onPress={onPress} style={[styles.TaskButton, { backgroundColor }]}>
        <AnimatedCircularProgress
            size={95}            
            width={10}
            backgroundWidth={0}
            lineCap='round'
            rotation={0}
            fill={progress} 
            tintColor='gold'
            children={() => <ThemedText style={{color}}>{title}</ThemedText>}
        />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  TaskButton: {
    width: 75,
    height: 75,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    alignSelf: 'center',
    display: 'flex'
  }
});