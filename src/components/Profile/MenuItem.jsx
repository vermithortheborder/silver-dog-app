import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";

export function MenuItem({
  icon: Icon,
  title,
  subtitle,
  onPress,
  colors,
  isLast = false,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.accent + "20",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Icon size={20} color={colors.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Sora_600SemiBold",
            fontSize: 16,
            color: colors.primary,
            marginBottom: 2,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 13,
              color: colors.secondary,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <ChevronRight size={20} color={colors.secondary} />
    </TouchableOpacity>
  );
}
