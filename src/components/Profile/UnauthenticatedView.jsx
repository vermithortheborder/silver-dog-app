import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { User } from "lucide-react-native";

export function UnauthenticatedView({ colors, onSignIn }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
      }}
    >
      <User size={64} color={colors.secondary} />
      <Text
        style={{
          fontFamily: "Sora_600SemiBold",
          fontSize: 20,
          color: colors.primary,
          marginTop: 24,
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        Inicia sesión para ver tu perfil
      </Text>
      <Text
        style={{
          fontFamily: "Sora_400Regular",
          fontSize: 14,
          color: colors.secondary,
          textAlign: "center",
          marginBottom: 32,
        }}
      >
        Accede a tus cursos y progreso
      </Text>
      <TouchableOpacity
        onPress={onSignIn}
        style={{
          backgroundColor: colors.accent,
          paddingHorizontal: 32,
          paddingVertical: 14,
          borderRadius: 24,
        }}
      >
        <Text
          style={{
            fontFamily: "Sora_600SemiBold",
            fontSize: 16,
            color: "#FFFFFF",
          }}
        >
          Iniciar Sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}
