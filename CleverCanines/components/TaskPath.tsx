import { Colors } from "@/constants/Colors";
import { groupInfo } from "@/stores/groupInfoStore";
import { View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import React from "react";


export default function TaskPath(props: { fill: boolean, left?: boolean}) {
  const { fill, left } = props;
  const group = groupInfo.getState().group.group;
  const tintColor =  Colors[group].color;
  const backgroundColor = useThemeColor({ light: Colors.light.tint, dark: Colors.dark.tint }, 'tint');
  return (
    <AnimatedCircularProgress style={{ alignSelf: "center", marginLeft: 10, marginRight: 10}}
        size={200}            
        width={10}
        backgroundWidth={0}
        lineCap='round'
        arcSweepAngle={90}
        rotation={ left ? 225 : 45}
        prefill={ fill ? 100 : 0 }
        fill={ fill ? 100 : 0 } 
        tintColor={tintColor}
        backgroundColor={backgroundColor}
    />
    );
    
}