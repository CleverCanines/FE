import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { ThemedText } from './ThemedText';

export default function LessonButton(props: { title: string, progress: number, onPress: () => void }) {
  const { title, progress,  onPress} = props;
  return (
    <Pressable style={styles.button}>
        <AnimatedCircularProgress
            size={150}            
            width={10}
            backgroundWidth={0}
            lineCap='round'
            rotation={0}
            fill={progress} 
            tintColor='gold'
            children={() => <ThemedText>{title}</ThemedText>}
        />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'navy',
    width: 130,
    height: 130,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
}); 

