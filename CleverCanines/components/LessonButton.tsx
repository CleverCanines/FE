import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { ThemedText } from './ThemedText';
import { groupInfo } from '@/stores/groupInfoStore';
import { Colors } from '@/constants/Colors';

export default function LessonButton(props: { title: string, progress: number, unlocked: boolean, onPress: () => void }) {
  const { title, progress,  unlocked, onPress} = props;
  const group = groupInfo.getState().group.group;
  const backgroundColor = unlocked ? Colors[group].color : "grey";
  const color = 'white';
  return (
    <Pressable onPress={onPress} style={[styles.button, { backgroundColor }]}>
        <AnimatedCircularProgress
            size={150}            
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
  button: {
    width: 130,
    height: 130,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    alignSelf: 'center'
  }
}); 

