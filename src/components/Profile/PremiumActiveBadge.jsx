import React from "react";
import { View, Text } from "react-native";
import { Crown } from "lucide-react-native";

export function PremiumActiveBadge() {
  return (
    <View
      style={{
        backgroundColor: "#10B981",
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        shadowColor: "#10B981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "rgba(255,255,255,0.25)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Crown size={28} color="#FFFFFF" fill="#FFFFFF" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Sora_800ExtraBold",
            fontSize: 18,
            color: "#FFFFFF",
            marginBottom: 4,
          }}
        >
          ✨ Miembro Premium Activo
        </Text>
        <Text
          style={{
            fontFamily: "Sora_400Regular",
            fontSize: 13,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          Disfruta de todos los beneficios
        </Text>
      </View>
    </View>
  );
}
