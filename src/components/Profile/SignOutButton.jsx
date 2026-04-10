import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { LogOut } from "lucide-react-native";

export function SignOutButton({ colors, onSignOut }) {
  return (
    <TouchableOpacity
      onPress={onSignOut}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.destructiveBackground,
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
      }}
    >
      <LogOut size={20} color={colors.destructive} />
      <Text
        style={{
          fontFamily: "Sora_600SemiBold",
          fontSize: 16,
          color: colors.destructive,
        }}
      >
        Cerrar Sesión
      </Text>
    </TouchableOpacity>
  );
}
