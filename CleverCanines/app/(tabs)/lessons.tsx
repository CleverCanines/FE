import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import  LessonButton from "@/components/LessonButton";

export default function LessonScreen() {
    return (
    <ThemedView>
        <ThemedText>Lessons placeholder text!</ThemedText>
        <LessonButton title='Basic' progress={66} onPress={ () => {} }/>
        <LessonButton title='Basic' progress={66} onPress={ () => {} }/>
        <LessonButton title='Basic' progress={66} onPress={ () => {} }/>
    </ThemedView>
    );
  }