import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { ThemedText } from './ThemedText';
import { groupInfo } from '@/stores/groupInfo';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function LessonButton(props: { title: string, progress: number, onPress: () => void }) {
  const { title, progress,  onPress} = props;
  const group = groupInfo.getState().group.group;
  const backgroundColor = Colors[group].color;
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
    margin: 10,
    alignSelf: 'center'
  }
}); 

