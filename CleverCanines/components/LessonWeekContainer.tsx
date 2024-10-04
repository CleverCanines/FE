import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import LessonButton from './LessonButton';

type Lesson = {
  orderIndex: number,
  lessonWeek: number,
  description: string,
  id: string,
  lessonType: string,
  title: string
};

export default function LessonWeekContainer(LessonContainerProps: { lessons: Lesson[] }) {
  const progress = 55;
  const { lessons } = LessonContainerProps;
  return (
    <div>
      {lessons[0].lessonWeek !== 1 ? <hr style={styles.hrLine}/> : null}
      <ThemedText style={styles.weekText} >Week {lessons[0].lessonWeek}</ThemedText>
      {lessons.map((lesson) => (
        <React.Fragment key={lesson.id}>
          <LessonButton title={lesson.title} progress={progress} onPress={() => {}} />
        </React.Fragment>
      ))}    
    </div>
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