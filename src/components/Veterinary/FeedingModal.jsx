import React from "react";
import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import { X } from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";

export function FeedingModal({
  visible,
  onClose,
  feedingTime,
  setFeedingTime,
  feedingMealType,
  setFeedingMealType,
  onSave,
}) {
  const { colors, isDark } = useAppTheme();

  const mealTypes = [
    { value: "desayuno", label: "🌅 Desayuno" },
    { value: "comida", label: "🍽️ Comida" },
    { value: "cena", label: "🌙 Cena" },
    { value: "snack", label: "🦴 Snack" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: colors.cardBackground,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            paddingBottom: 40,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontFamily: "Sora_800ExtraBold",
                fontSize: 20,
                color: colors.primary,
              }}
            >
              Programar Alimentación
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.secondary} />
            </TouchableOpacity>
          </View>

          {/* Meal Type Selection */}
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 14,
              color: colors.secondary,
              marginBottom: 12,
            }}
          >
            Tipo de comida
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {mealTypes.map((meal) => (
              <TouchableOpacity
                key={meal.value}
                onPress={() => setFeedingMealType(meal.value)}
                style={{
                  backgroundColor:
                    feedingMealType === meal.value
                      ? colors.accent
                      : isDark
                        ? "#2A2A2A"
                        : "#F5F5F5",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor:
                    feedingMealType === meal.value
                      ? colors.accent
                      : colors.border,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 14,
                    color:
                      feedingMealType === meal.value
                        ? "#FFFFFF"
                        : colors.primary,
                  }}
                >
                  {meal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Time Input */}
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 14,
              color: colors.secondary,
              marginBottom: 12,
            }}
          >
            Hora (formato 24h)
          </Text>
          <TextInput
            style={{
              backgroundColor: isDark ? "#1A1A1A" : "#F5F5F5",
              borderRadius: 12,
              padding: 16,
              fontFamily: "Sora_400Regular",
              fontSize: 16,
              color: colors.primary,
              marginBottom: 24,
            }}
            placeholder="Ej: 08:00, 14:30, 19:00"
            placeholderTextColor={colors.secondary}
            value={feedingTime}
            onChangeText={setFeedingTime}
            keyboardType="numbers-and-punctuation"
          />

          {/* Save Button */}
          <TouchableOpacity
            onPress={onSave}
            style={{
              backgroundColor: colors.accent,
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              Programar Recordatorio
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
