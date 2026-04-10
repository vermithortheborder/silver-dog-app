import React from "react";
import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import { X } from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";

export function WalkModal({
  visible,
  onClose,
  walkTime,
  setWalkTime,
  walkDuration,
  setWalkDuration,
  onSave,
}) {
  const { colors, isDark } = useAppTheme();

  const durations = ["15", "30", "45", "60"];

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
              Programar Paseo
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.secondary} />
            </TouchableOpacity>
          </View>

          {/* Duration Selection */}
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 14,
              color: colors.secondary,
              marginBottom: 12,
            }}
          >
            Duración del paseo
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {durations.map((duration) => (
              <TouchableOpacity
                key={duration}
                onPress={() => setWalkDuration(duration)}
                style={{
                  backgroundColor:
                    walkDuration === duration
                      ? colors.accent
                      : isDark
                        ? "#2A2A2A"
                        : "#F5F5F5",
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor:
                    walkDuration === duration ? colors.accent : colors.border,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 14,
                    color:
                      walkDuration === duration ? "#FFFFFF" : colors.primary,
                  }}
                >
                  {duration} min
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
            placeholder="Ej: 07:00, 18:30"
            placeholderTextColor={colors.secondary}
            value={walkTime}
            onChangeText={setWalkTime}
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
              Programar Paseo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export function ExerciseModal({
  visible,
  onClose,
  exerciseTime,
  setExerciseTime,
  exerciseType,
  setExerciseType,
  onSave,
}) {
  const { colors, isDark } = useAppTheme();

  const activities = [
    { value: "jugar", label: "🎾 Jugar" },
    { value: "correr", label: "🏃 Correr" },
    { value: "nadar", label: "🏊 Nadar" },
    { value: "entrenar", label: "🎯 Entrenar" },
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
              Programar Ejercicio
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.secondary} />
            </TouchableOpacity>
          </View>

          {/* Activity Type Selection */}
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 14,
              color: colors.secondary,
              marginBottom: 12,
            }}
          >
            Tipo de actividad
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {activities.map((activity) => (
              <TouchableOpacity
                key={activity.value}
                onPress={() => setExerciseType(activity.value)}
                style={{
                  backgroundColor:
                    exerciseType === activity.value
                      ? colors.accent
                      : isDark
                        ? "#2A2A2A"
                        : "#F5F5F5",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor:
                    exerciseType === activity.value
                      ? colors.accent
                      : colors.border,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 14,
                    color:
                      exerciseType === activity.value
                        ? "#FFFFFF"
                        : colors.primary,
                  }}
                >
                  {activity.label}
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
            placeholder="Ej: 08:00, 17:30"
            placeholderTextColor={colors.secondary}
            value={exerciseTime}
            onChangeText={setExerciseTime}
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
              Programar Ejercicio
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
