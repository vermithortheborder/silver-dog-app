import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { Image } from "expo-image";

export default function LoadingLogo({ size = 80 }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Animación de escala (pulso)
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    // Animación de rotación suave
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    // Animación de opacidad
    const opacityAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    scaleAnimation.start();
    rotateAnimation.start();
    opacityAnimation.start();

    return () => {
      scaleAnimation.stop();
      rotateAnimation.stop();
      opacityAnimation.stop();
    };
  }, [scaleAnim, rotateAnim, opacityAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }, { rotate }],
          opacity: opacityAnim,
        }}
      >
        <Image
          source={{
            uri: "https://raw.createusercontent.com/936e123f-a514-47e8-ae22-0d2490f35659/",
          }}
          style={{ width: size, height: size }}
          contentFit="contain"
          transition={200}
        />
      </Animated.View>
    </View>
  );
}
