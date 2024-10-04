import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import LessonButton from './LessonButton';
import { useRouter } from 'expo-router';

type Lesson = {
  orderIndex: number,
  lessonWeek: number,
  description: string,
  id: string,
  lessonType: string,
  title: string
};

export default function LessonWeekContainer(LessonContainerProps: { lessons: Lesson[] }) {
  const router = useRouter();
  
  const progress = 55; // TODO: get progress from user interaction tables once they are implemented

  const { lessons } = LessonContainerProps;
  return (
    <>
      {lessons[0].lessonWeek !== 1 ? <hr style={styles.hrLine}/> : null}
      <ThemedText style={styles.weekText} >Week {lessons[0].lessonWeek}</ThemedText>
      {lessons.map((lesson) => (
        <React.Fragment key={lesson.id}>
          <LessonButton 
          title={lesson.title} 
          progress={progress} 
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
    marginLeft: 10,
    marginRight: 10,
  }
}); 