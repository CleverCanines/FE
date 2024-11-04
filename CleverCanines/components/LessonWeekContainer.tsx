import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import LessonButton from './LessonButton';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

type Lesson = {
  orderIndex: number,
  lessonWeek: number,
  description: string,
  id: string,
  lessonType: string,
  title: string
};

type LessonInteraction = {
  lessonId: string,
  personId: string,
  progress: number
};

export default function LessonWeekContainer(LessonContainerProps: { lessons: Lesson[], interactions: LessonInteraction[] }) {
  const router = useRouter();

  const { lessons, interactions } = LessonContainerProps;
  const borderBottomColor = useThemeColor({ light: Colors.light.tint, dark: Colors.dark.tint }, 'tint');
  return (
    <>
      {lessons[0].lessonWeek !== 1 ? <View style={[styles.hrLine, {borderBottomColor}]}/> : null}
      <ThemedText style={styles.weekText} >Week {lessons[0].lessonWeek}</ThemedText>
      {lessons.map((lesson) => (
        <React.Fragment key={lesson.id}>
          <LessonButton 
          title={lesson.title} 
          progress={interactions.find((interaction) => interaction.lessonId === lesson.id)?.progress || 0}
          onPress={() => {
            router.push({ 
              pathname: '/tasks', 
              params: { 
                lessonId: lesson.id, 
                title: lesson.title
              }
            });
          }} />
        </React.Fragment>
      ))}    
    </>
  );
}

//stylesheet for week [number] text 
// centers the text and gives it a margin of 10
const styles = StyleSheet.create({
  weekText: {
    display: 'flex',
    justifyContent: 'center',
    margin: 10
  },
  hrLine: {
    borderBottomWidth: 1,
    marginVertical: 10,
  }
}); 