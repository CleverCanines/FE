import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { groupInfo } from "@/stores/groupInfo";
import { Colors } from "@/constants/Colors";
import { Group } from "@/features/groupInfo/groupInfoSlice";


export default function StandardButton(props: { title: string, group?: Group, onPress: () => void }) {
    const { title, onPress } = props;
    const group = props.group || groupInfo.getState().group.value;
    const groupColor = Colors[group];

    return (
        <Pressable onPress={onPress} style={({ pressed }) => [
        {
            backgroundColor: pressed
            ? groupColor.pressed
            : groupColor.color
        },
        styles.standardButton
        ]}>
        <ThemedText style={styles.text}>{title}</ThemedText>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    standardButton: {
        width: 150,
        height: 75,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        alignSelf: 'center'
    },
    text: {
        fontSize: 24,
        color: 'white'
    }
    });