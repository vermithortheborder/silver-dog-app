import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";

export function RoleActionButton({
  backgroundColor,
  emoji,
  title,
  subtitle,
  icon: Icon,
  onPress,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: backgroundColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: "rgba(255,255,255,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {emoji ? (
            <Text style={{ fontSize: 28 }}>{emoji}</Text>
          ) : (
            Icon && <Icon size={28} color="#FFFFFF" />
          )}
        </View>
        <View>
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 18,
              color: "#FFFFFF",
              marginBottom: 4,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 13,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: "rgba(255,255,255,0.2)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ChevronRight size={20} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
}
