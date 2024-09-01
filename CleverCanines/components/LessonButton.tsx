// This component is the button that makes up the lesson screen.
// They are circular and have a title, and a progress bar around the edge. 
// The progress bar is a circle that fills up as the user progresses through the lesson.
// The button greys out when the lesson group is locked and is otherwise the color of the user group.

import React from 'react';
import { Pressable } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { ThemedText } from './ThemedText';

export default function LessonButton({ title, progress, locked, userGroup }: { title: string, progress: number, locked: boolean, userGroup: string }) {
  return (
    <Pressable>
        <AnimatedCircularProgress
            size={150}
            width={10}
            backgroundWidth={0}
            fill={progress} 
            tintColor='gold'
            backgroundColor='grey'
            children={() => <ThemedText>{title}</ThemedText>}
        />
      {/* <CircularProgress
        value={progress}
        background={true}
        styles={buildStyles({
          strokeLinecap: 'round',
          textSize: '16px',
          pathTransitionDuration: 0.25,
          pathColor: `gold`,
          textColor: '#ECEDEEr',
          trailColor: 'blue',
          backgroundColor: 'blue',
        })}
      /> */}
    </Pressable>
  );
}
