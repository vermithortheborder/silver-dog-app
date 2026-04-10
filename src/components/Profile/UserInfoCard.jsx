import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { Mail } from "lucide-react-native";

export function UserInfoCard({ user, userRole, colors }) {
  const getRoleDisplay = (role) => {
    switch (role) {
      case "admin":
        return "🔑 Administrador";
      case "instructor":
        return "👨‍🏫 Instructor";
      case "veterinario":
        return "🐶 Veterinario";
      case "student":
        return "🎓 Alumno";
      default:
        return "🎓 Alumno";
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.accent,
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: "rgba(255, 255, 255, 1)",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
          padding: 8,
        }}
      >
        <Image
          source="https://ucarecdn.com/325c26b3-7b39-4af8-b91a-f8e634a5b668/-/format/auto/"
          style={{ width: "100%", height: "100%" }}
          contentFit="contain"
          transition={100}
        />
      </View>
      <Text
        style={{
          fontFamily: "Sora_800ExtraBold",
          fontSize: 24,
          color: "#FFFFFF",
          marginBottom: 4,
        }}
      >
        {user.name || "Usuario"}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <Mail size={16} color="rgba(255, 255, 255, 0.8)" />
        <Text
          style={{
            fontFamily: "Sora_400Regular",
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          {user.email}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 8,
          alignSelf: "flex-start",
        }}
      >
        <Text
          style={{
            fontFamily: "Sora_600SemiBold",
            fontSize: 14,
            color: "#FFFFFF",
          }}
        >
          {getRoleDisplay(userRole)}
        </Text>
      </View>
    </View>
  );
}
