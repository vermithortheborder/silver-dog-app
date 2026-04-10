import React from "react";
import { View, Text, TextInput } from "react-native";
import { useAppTheme } from "@/components/AppTheme";

export function InfoField({
  icon: Icon,
  label,
  value,
  editable,
  onChangeText,
  placeholder,
  editMode,
}) {
  const { colors, isDark } = useAppTheme();

  return (
    <View style={{ marginBottom: 16 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
          gap: 8,
        }}
      >
        <Icon size={16} color={colors.accent} />
        <Text
          style={{
            fontFamily: "Sora_600SemiBold",
            fontSize: 14,
            color: colors.secondary,
          }}
        >
          {label}
        </Text>
      </View>
      {editMode && editable ? (
        <TextInput
          style={{
            backgroundColor: isDark ? "#1A1A1A" : "#F5F5F5",
            borderRadius: 12,
            padding: 12,
            fontFamily: "Sora_400Regular",
            fontSize: 15,
            color: colors.primary,
          }}
          placeholder={placeholder || label}
          placeholderTextColor={colors.secondary}
          value={value}
          onChangeText={onChangeText}
        />
      ) : (
        <Text
          style={{
            fontFamily: "Sora_400Regular",
            fontSize: 15,
            color: colors.primary,
          }}
        >
          {value || "No registrado"}
        </Text>
      )}
    </View>
  );
}
